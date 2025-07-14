import useCustomer from "@/features/authentication/hooks/useCustomer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";
import useMutations from "../hooks/useMutations";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { phoneValidRegx } from "@/components/address/useAddressForm";
import useRegistration from "@/features/authentication/hooks/useRegistration";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import PhoneInput, {
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CountryCode } from "@/lib/countryCodes";
import OtpButton from "@/features/authentication/components/RenderOtpBtns";
import { useBlocking } from "@/features/authentication/components/blockingContext";
import useAuth from "@/features/authentication/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import OtpModal from "@/features/authentication/components/OtpModal";
import { Button } from "@/components/ui/button";
import CircularProgress from "@/components/icons/CircularProgress";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { updateCustomer } from "@/features/authentication/slice/auth";

function SecurityInfo() {
  // states
  const [mailAvailable, setMailAvailable] = useState(true);
  const [mobileNumberCountryCode, setMobileNumberCountryCode] =
    useState<CountryCode>("AE");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [customerEmailState, setCustomerEmail] = useState("");

  // hooks
  const customer = useAppSelector((state) => state.auth.value);
  const { validateMobile } = useRegistration({
    mailAvailable,
    isOtpVerified: isOtpVerified,
  });
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    updateCustomer: [updateCustomerCall, updateCustomerStatus],
  } = useMutations();
  const { isBlocked, storeToLocalStorage } = useBlocking();
  const {
    requestOtpForMobileUpdation: [
      requestOtpForMobileUpdation,
      requestOtpForMobileUpdationStatus,
    ],
    verifyOtpForMobileUpdation: [
      verifyOtpForMobileUpdation,
      verifyOtpForMobileUpdationStatus,
    ],
  } = useAuth();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // computed
  const customerFirstName = useMemo(() => customer?.firstname, [customer]);
  const customerMobile = useMemo(() => customer?.mobilenumber, [customer]);
  const customerId = useMemo(() => customer?.id || 29, [customer]);
  const customerEmail = useMemo(() => customer?.email, [customer]);

  // constants
  const initialPhoneNumber = useMemo(
    () => ({
      mobile: parsePhoneNumber(`+${customerMobile}`)?.number || "",
      mobileNumberCountryCode: "AE",
    }),
    [customerMobile]
  );
  const validationSchemaMoble = useMemo(
    () =>
      Yup.object().shape({
        mobileNumberCountryCode: Yup.string().required(
          "Country code is required"
        ),
        mobile: Yup.string()
          .required("Mobile number is required")
          .matches(phoneValidRegx, "Mobile number is not valid")
          .when(
            "mobileNumberCountryCode",
            ([mobileNumberCountryCode], schema) =>
              mobileNumberCountryCode === "AE"
                ? schema
                    .min(13, "Mobile number must be exactly 12 digits for AE")
                    .max(13, "Mobile number must be exactly 12 digits for AE")
                : // .matches(/^[0-9]{12}$/, "Mobile number must contain exactly 12 digits")
                  schema
          )
          // .test("validate-mobile", "", validateMobile),
        // need to change accordingly
      }),
    [validateMobile, mobileNumberCountryCode]
  );
  const mobileFormik = useFormik({
    initialValues: initialPhoneNumber,
    validationSchema: validationSchemaMoble,
    onSubmit(values, formikHelpers) {
      const cleanedNumber = values.mobile.replace(/\+/g, "");
      const cleanedOldMobile = initialPhoneNumber.mobile.replace(/\+/g, "");

      // console.log("sumbit handler");

      if (mobileNumberCountryCode !== "AE") {
        setIsOtpVerified(true);
        verifyOtpForMobileUpdation({
          variables: {
            customerId: customerId.toString(),
            oldmobileNumber: cleanedOldMobile,
            newmobileNumber: cleanedNumber,
            otp: "234556",
            websiteId: 1,
          },
          onCompleted(data, clientOptions) {
            if (data.updateMobileNumberOTPVerify) {
              const parsedRepsonse = JSON.parse(
                data.updateMobileNumberOTPVerify.response as string
              ) as { status: boolean; token: string; message: string }[];

              if (parsedRepsonse?.[0].status) {
                if (customerFirstName) {
                  updateCustomerCall({
                    variables: {
                      input: {
                        firstname: customerFirstName,
                      },
                    },
                    onCompleted(data, clientOptions) {
                      if (data.updateCustomerV2.customer) {
                        dispatch(
                          updateCustomer(data.updateCustomerV2.customer)
                        );
                        toast({
                          title: "Update customer",
                          description: "Updated Successfully",
                          variant: "success",
                        });
                      }
                    },
                  });
                }
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
      } else if (isOtpVerified) {
        if (customerFirstName) {
          updateCustomerCall({
            variables: {
              input: {
                firstname: customerFirstName,
              },
            },
            onCompleted(data, clientOptions) {
              if (data.updateCustomerV2.customer) {
                dispatch(updateCustomer(data.updateCustomerV2.customer));
                toast({
                  title: "Update customer",
                  description: "Updated Successfully",
                  variant: "success",
                });
              }
            },
          });
        }
      }else{
        toast({
          title: "OTP Verification",
          description: "You need to verfiy the mobile number",
          variant: "warning",
        });
      }
    },
  });

  //   features
  const onVarified = ({ flag, otp }: { flag: boolean; otp?: string }) => {
    setIsOtpVerified(flag);
    if (flag) {
      setIsOtpVerified(true);
    }
  };
  const requestOtp = () => {
    const cleanedMobileOld = initialPhoneNumber.mobile.replace(/\+/g, "");
    const cleanedMobile = mobileFormik.values.mobile.replace(/\+/g, "");
    if (!isBlocked) {
      if (customerId)
        requestOtpForMobileUpdation({
          variables: {
            customerId: customerId.toString(),
            oldmobileNumber: cleanedMobileOld,
            newmobileNumber: cleanedMobile,
            isresend: true,
            websiteId: 1,
          },
          onCompleted(data, clientOptions) {
            if (data.updateMobilenumber) {
              const decodedResponse = JSON.parse(
                data.updateMobilenumber.response as string
              ) as { status: boolean; message: string }[];

              if (decodedResponse?.[0].status) {
                // toast({
                //   title: "Request OTP",
                //   description:
                //     decodedResponse?.[0].message || "OTP has been send",
                //   variant: "success",
                // });
                setOtpModalOpen(true);
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
    } else {
      setOtpModalOpen(true);
    }
  };

  //   effects
  useEffect(() => {
    if (isOtpVerified) mobileFormik.validateForm();
  }, [isOtpVerified]);
  useEffect(() => {
    if (mobileNumberCountryCode !== "AE") {
      setIsOtpVerified(true);
    } else {
      setIsOtpVerified(false);
    }
  }, [mobileNumberCountryCode]);

  useEffect(() => {
    if (customerEmail) setCustomerEmail(customerEmail);
  }, [customerEmail]);

  useEffect(() => {
    if (editPhone && mobileNumberCountryCode !== "AE") {
      setIsOtpVerified(true);
    }
  }, [editPhone]);

  useEffect(() => {
    if (customer?.mobilenumber) {
      mobileFormik.setFieldValue(
        "mobile",
        parsePhoneNumber(`+${customerMobile}`)?.number || ""
      );
    }
  }, [customer]);

  // console.log("mobile number", mobileFormik.values);

  return (
    <>
      <div className="general_info security">
        <h2 className="text-h3">Security</h2>
        <div className="info_area">
          <div className="inputs">
            <div className="input_grup">
              <label htmlFor="mobile">Mobile No.*</label>
              <div className="phone_wrap">
                <div className="code">
                  {"+" + getCountryCallingCode(mobileNumberCountryCode)}
                </div>
                <PhoneInput
                  ref={(input) => {}}
                  name="mobile"
                  defaultCountry={mobileNumberCountryCode}
                  disabled={!editPhone}
                  placeholder="Enter your mobile number..."
                  value={mobileFormik.values.mobile}
                  onChange={(value) => {
                    mobileFormik
                      .setFieldValue("mobile", value || "")
                      .then(() => {
                        mobileFormik.validateForm();
                      });
                  }}
                  onCountryChange={(country) => {
                    // console.log("country from register phone", country);
                    if (country) {
                      setMobileNumberCountryCode(country);
                      mobileFormik.setFieldValue(
                        "mobileNumberCountryCode",
                        country
                      );
                    }
                  }}
                  onBlur={mobileFormik.handleBlur}
                  international={false}
                  countryCallingCodeEditable={false}
                />
                {mobileFormik.values["mobile"] &&
                mobileNumberCountryCode === "AE" &&
                !mobileFormik.errors["mobile"] &&
                editPhone ? (
                  <OtpButton
                    isOtpVerified={isOtpVerified}
                    requestOtp={requestOtp}
                    requestOtpCustomerStatus={requestOtpForMobileUpdationStatus}
                    registrationFormErrors={mobileFormik.errors}
                  />
                ) : null}

                {mobileFormik.errors["mobile"] &&
                mobileFormik.touched["mobile"] &&
                editPhone ? (
                  <div className="error">
                    <p>{mobileFormik.errors["mobile"]}</p>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="input_grup">
              <label htmlFor="lastname">Email</label>
              <Input
                type="text"
                placeholder="example@example.com"
                value={customerEmailState || ""}
                onChange={(e) => setCustomerEmail(e.target.value)}
                // {...generalFormik.getFieldProps("lastname")}
                // error={
                //   !!generalFormik.errors["lastname"] &&
                //   generalFormik.touched["lastname"]
                // }
                // errorTxt={generalFormik.errors["lastname"]}
                disabled
              />
            </div>
          </div>
          <div className="btns">
            <Button
              variant={"action_green"}
              type={editPhone ? "submit" : "button"}
              className="btn_action_green_rounded"
              onClick={(e) => {
                e.preventDefault();
                if (editPhone) {
                  mobileFormik.submitForm();
                } else {
                  setEditPhone(true);
                }
              }}
            >
              {updateCustomerStatus.loading ||
              verifyOtpForMobileUpdationStatus.loading ? (
                <span>
                  <CircularProgress />
                </span>
              ) : (
                <BtnRightArrow />
              )}

              <span>{!editPhone ? "Update Mobile number" : "Update"}</span>
            </Button>
            {editPhone ? (
              <Button
                variant={"action_green"}
                type="button"
                onClick={() => {
                  mobileFormik.setValues({
                    mobile: initialPhoneNumber.mobile || "",
                    mobileNumberCountryCode:
                      initialPhoneNumber.mobileNumberCountryCode || "AE",
                  }); // Reset to latest customer values
                  setEditPhone(false);
                }}
                className="btn_action_green_rounded"
              >
                <BtnRightArrow />
                <span>CANCEL</span>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <OtpModal
        verifyType="update_mobile"
        isOpen={otpModalOpen}
        setIsOpen={setOtpModalOpen}
        mobile={mobileFormik.values["mobile"]}
        setFieldValue={mobileFormik.setFieldValue}
        onVarified={onVarified}
        oldMobile={initialPhoneNumber.mobile}
      />
    </>
  );
}

export default SecurityInfo;
