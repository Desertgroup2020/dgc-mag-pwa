import Modal from "@/components/reusable-uis/Modal";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../styles/otp_modal.module.scss";
import { Button } from "@/components/ui/button";
import useCountdown from "@/lib/hooks";
import useAuth from "../hooks/useAuth";
import { useFormik } from "formik";
import useRegistration from "../hooks/useRegistration";
import { LoaderCircle } from "lucide-react";
import { useBlocking } from "./blockingContext";
import { useToast } from "@/components/ui/use-toast";
import useCustomer from "../hooks/useCustomer";
import { useAppSelector } from "@/redux/hooks";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  mobile: string;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
  onVarified: ({ flag, otp }: { flag: boolean; otp?: string }) => void;
  verifyType: "register" | "signin" | "update_mobile";
  oldMobile?: string;
}
function OtpModal({
  isOpen,
  setIsOpen,
  mobile,
  setFieldValue,
  onVarified,
  verifyType,
  oldMobile,
}: Props) {
  const {
    requestOtpCustomer: [requestOtpCustomer, requestOtpCustomerStatus],
    verifyCustomerOtp: [verifyCustomerOtp, verifyCustomerOtpStatus],
    requestOtpForMobileUpdation: [
      requestOtpForMobileUpdation,
      requestOtpForMobileUpdationStatus,
    ],
    verifyOtpForMobileUpdation: [
      verifyOtpForMobileUpdation,
      verifyOtpForMobileUpdationStatus,
    ],
  } = useAuth();
  const customerId = useAppSelector(state=>state.auth.value?.id || "29")
  const { isBlocked, storeToLocalStorage, formatTime, blockUserTiming } =
    useBlocking();
  const { toast } = useToast();

  const { otpValidationSchema } = useRegistration({});
  const initialCount = 60; // For example, start from 10

  const { count, start, reset, stop } = useCountdown({
    initialCount,
    onExpire: () => {
      // console.log("time expired");
    },
  });

  // resend timer functionality
  useEffect(() => {
    if (isOpen) {
      start();
    }

    return () => reset();
  }, [isOpen, start, useCountdown]);
  // ===

  //requesting OTP
  const resendHandler = () => {
    if (mobile && !isBlocked) {
      const cleanedMobile = mobile.replace(/\+/g, "");
      requestOtpCustomer({
        variables: {
          isresend: false,
          mobileNumber: cleanedMobile,
          websiteId: 1,
        },
        onCompleted(data) {
          if (data.createAccountOTP.response) {
            const decodedResponse = JSON.parse(
              data.createAccountOTP.response as string
            ) as { status: boolean; message: string }[];
            if (decodedResponse?.[0].status) {
              toast({
                title: "Request OTP",
                description:
                  decodedResponse?.[0].message || "OTP has been send",
                variant: "success",
              });
              reset();
              start();
              storeToLocalStorage();
            } else {
              toast({
                title: "Ooops!",
                description: decodedResponse?.[0].message || "OTP failed",
                variant: "error",
              });
            }
          }
        },
        onError(error) {
          throw error;
        },
      });
    } else if (isBlocked) {
    }
  };
  const resendHandlerForUpdateMobile = () => {
    if (mobile && !isBlocked && customerId && oldMobile) {
      const cleanedOldMobile = oldMobile.replace(/\+/g, "");
      const cleanedMobile = mobile.replace(/\+/g, "");
      requestOtpForMobileUpdation({
        variables: {
          customerId: customerId.toString(),
          oldmobileNumber: cleanedOldMobile,
          newmobileNumber: cleanedMobile,
          isresend: true,
          websiteId: 1,
        },
        onCompleted(data) {
          if (data.updateMobilenumber.response) {
            const decodedResponse = JSON.parse(
              data.updateMobilenumber.response as string
            ) as { status: boolean; message: string }[];
            if (decodedResponse?.[0].status) {
              toast({
                title: "Request OTP",
                description:
                  decodedResponse?.[0].message || "OTP has been send",
                variant: "success",
              });
              reset();
              start();
              storeToLocalStorage();
            } else {
              toast({
                title: "Ooops!",
                description: decodedResponse?.[0].message || "OTP failed",
                variant: "error",
              });
            }
          }
        },
      });
    } else if (isBlocked) {
    }
  };
  // ===

  //varifying OTP
  const otpform = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpValidationSchema,
    onSubmit(values, formikHelpers) {
      if (values.otp && mobile) {
        const cleanedMobile = mobile.replace(/\+/g, "");
        if (verifyType === "update_mobile" && customerId && oldMobile) {
          const cleanedOldMobile = oldMobile.replace(/\+/g, "");
          verifyOtpForMobileUpdation({
            variables: {
              customerId: customerId.toString(),
              oldmobileNumber: cleanedOldMobile,
              newmobileNumber: cleanedMobile,
              otp: values.otp,
              websiteId: 1,
            },
            onCompleted(data, clientOptions) {
              if (data.updateMobileNumberOTPVerify) {
                const parsedRepsonse = JSON.parse(
                  data.updateMobileNumberOTPVerify.response as string
                ) as { status: boolean; token: string; message: string }[];

                if (parsedRepsonse?.[0].status) {
                  onVarified({ flag: true, otp: values.otp });
                  reset();
                  setIsOpen(false);
                } else {
                  toast({
                    title: "Ooops!",
                    description:
                      parsedRepsonse?.[0].message || "OTP verification failed",
                    variant: "error",
                  });
                }
              }
            },
            onError(error, clientOptions) {
              onVarified({ flag: false });
              throw error;
            },
          });
        } else if(verifyType === "register") {
          verifyCustomerOtp({
            variables: {
              mobileNumber: cleanedMobile,
              otp: values.otp,
              websiteId: 1,
            },
            onCompleted(data, clientOptions) {
              if (data.createAccountOTPVerify) {
                const parsedRepsonse = JSON.parse(
                  data.createAccountOTPVerify.response as string
                ) as { status: boolean; token: string; message: string }[];

                if (parsedRepsonse?.[0].status) {
                  onVarified({ flag: true, otp: values.otp });
                  reset();
                  setIsOpen(false);
                } else {
                  toast({
                    title: "Ooops!",
                    description:
                      parsedRepsonse?.[0].message || "OTP verification failed",
                    variant: "error",
                  });
                }
              }
            },
            onError(error, clientOptions) {
              onVarified({ flag: false });
              throw error;
            },
          });
        }
      }
    },
  });
  //   ===

  // console.log("block user timing", blockUserTiming);

  return (
    <div className={`otp_modal`}>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={verifyType === "update_mobile" ? "Update Mobile" : "Register"}
        className="otp"
        notCloseOnOutside={true}
      >
        {isBlocked ? (
          <div className="time_expired">
            <p className="otp-timeout-text">
              Your limit exceeded please try after{" "}
              {formatTime((!!blockUserTiming && blockUserTiming) || 0)} minutes
            </p>
          </div>
        ) : (
          <div className={`otp_modal_cnts ${styles.otp_modal_cnts}`}>
            <div className="head">
              <h3 className="text-pcard_price">Enter the One Time Password</h3>
              <p>
                OTP has been sent to your mobile,{" "}
                <span className="mobile">{mobile}</span>{" "}
                <button>Wrong number?</button>
              </p>
            </div>
            <form onSubmit={otpform.handleSubmit}>
              <div className="otp_sec">
                <InputOTP
                  maxLength={6}
                  value={otpform.values["otp"] || ""}
                  className="otp_field"
                  name="otp"
                  onChange={(value) => {
                    otpform.setFieldValue("otp", value);
                    otpform.handleChange;
                  }}
                  onBlur={otpform.handleBlur}
                >
                  <InputOTPGroup
                    className={`otp_field_grup ${
                      otpform.errors["otp"] ? "error" : ""
                    }`}
                  >
                    <InputOTPSlot index={0} className="otp_block" />
                    <InputOTPSlot index={1} className="otp_block" />
                    <InputOTPSlot index={2} className="otp_block" />
                    <InputOTPSlot index={3} className="otp_block" />
                    <InputOTPSlot index={4} className="otp_block" />
                    <InputOTPSlot index={5} className="otp_block" />
                  </InputOTPGroup>
                </InputOTP>

                {count > 0 ? (
                  <span className="resend block">Resend OTP in {count}</span>
                ) : (
                  <button
                    className="resend"
                    disabled={
                      verifyCustomerOtpStatus.loading ||
                      requestOtpCustomerStatus.loading ||
                      requestOtpForMobileUpdationStatus.loading
                    }
                    onClick={
                      verifyType === "update_mobile"
                        ? resendHandlerForUpdateMobile
                        : resendHandler
                    }
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <Button
                type="submit"
                variant={"action_green"}
                className="w-full submit_btn text-pcard_price text-white normal_btn"
                disabled={
                  verifyCustomerOtpStatus.loading ||
                  requestOtpCustomerStatus.loading || verifyOtpForMobileUpdationStatus.loading
                }
              >
                <span>VERIFY</span>
                {verifyCustomerOtpStatus.loading || verifyOtpForMobileUpdationStatus.loading ? (
                  <LoaderCircle className="animate-spin" />
                ) : null}
              </Button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OtpModal;
