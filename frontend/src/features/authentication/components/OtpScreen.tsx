import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useCountdown from "@/lib/hooks";
import React, { useEffect } from "react";
import { useBlocking } from "./blockingContext";
import styles from "../styles/email_login.module.scss";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import useLogin from "../hooks/useLogin";
import { useLoginContext } from "./loginContext";
import { LoaderCircle } from "lucide-react";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { toast } from "@/components/ui/use-toast";

function OtpScreen() {
  const { blockUserTiming, formatTime, isBlocked } = useBlocking();
  const { otpValidationSchema } = useLogin();
  const { count, reset, start } = useCountdown({
    initialCount: 120,
    onExpire() {},
  });
  const {
    isMobileOtp,
    otpGivenEmail,
    otpGivenMobile,
    loginWithEmailFn,
    loginWithPhone,
    requestingOtp,
    logingIn,
    currentScreen,
    setCurrentScreen,
    requestOtpForEmail,
    requestOtpForMobile,
  } = useLoginContext();

  const otpform = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpValidationSchema,
    onSubmit(values, formikHelpers) {
      if (!isMobileOtp && otpGivenEmail) {
        loginWithEmailFn(values.otp);
      } else if (isMobileOtp && otpGivenMobile) {
        loginWithPhone({
          mobileNumber: otpGivenMobile,
          otp: values.otp,
          websiteId: 1,
        });
      }
    },
  });

  const resendHandler = () => {
    reset();
    if (!isMobileOtp && otpGivenEmail) {
      requestOtpForEmail(otpGivenEmail, 1, (response) => {
        if (
          response.generateAndSendOtp.response ===
          "OTP has been sent successfully."
        ) {
          start();
        } else {
          toast({
            title: "Ooops!!",
            description: response.generateAndSendOtp.response,
            variant: "error",
          });
        }
      });
    } else if (isMobileOtp && otpGivenMobile) {
      requestOtpForMobile(otpGivenMobile, 1, (response) => {
        if (response.loginOTP) {
          const parsedRepsonse = JSON.parse(
            response.loginOTP.response as string
          ) as { status: boolean; message: string }[];

          if (parsedRepsonse?.[0].status) {
            start();
          }
        }
      });
    }
  };

  useEffect(() => {
    if (currentScreen === "otp") {
      start();
    }

    return () => reset();
  }, [currentScreen, start, useCountdown]);

  return (
    <div className={`${styles.otp_screen} otp_screen`}>
      {isBlocked ? (
        <div className="time_expired">
          <p className="otp-timeout-text">
            Your limit exceeded please try after{" "}
            <span className=" font-600">
              {formatTime((!!blockUserTiming && blockUserTiming) || 0)}
            </span>{" "}
            minutes
          </p>
        </div>
      ) : (
        <div className={`otp_modal_cnts`}>
          <div className="head">
            <h3 className="text-pcard_price">Enter the One Time Password</h3>
            <p>
              OTP has been sent to your {isMobileOtp ? "mobile" : "email"},{" "}
              <span className="mobile">
                {isMobileOtp ? otpGivenMobile : otpGivenEmail}
              </span>{" "}
              <Button
                variant={"itself"}
                size={"iteself"}
                onClick={() => {
                  reset();

                  setCurrentScreen("form");
                }}
              >
                Wrong {isMobileOtp ? "mobile" : "email"}?
              </Button>
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
                <span className="resend block">Resend OTP in {formatTime(count)}</span>
              ) : (
                <button
                  className="resend"
                  disabled={requestingOtp}
                  onClick={resendHandler}
                >
                  Resend OTP
                </button>
              )}
            </div>

            <Button
              type="submit"
              variant={"itself"}
              className="w-full submit_btn text-pcard_price text-white normal_btn"
              disabled={logingIn || requestingOtp}
            >
              <span>Sign In</span>
              {logingIn ? <LoaderCircle className="animate-spin" /> : null}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default OtpScreen;
