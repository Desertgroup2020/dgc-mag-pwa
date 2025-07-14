"use client";

import useRegistration from "@/features/authentication/hooks/useRegistration";
import React, { useEffect, useState } from "react";
import useWholesaleRegistration from "../hooks/useWholesaleRegistration";
import { useBlocking } from "@/features/authentication/components/blockingContext";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/features/authentication/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import styles from "../../authentication/styles/register.module.scss";
import dynamic from "next/dynamic";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { withoutAuth } from "@/hocs/ProtectedRoutes";
import FileUploadButton from "@/components/reusable-uis/FileUploadButton";
import { CreateWholesalerAccountType } from "../apollo/mutations";
import useWholesaler from "../hooks/useWholesaler";
import {
  fetchCustomer,
  updateCustomer,
  updateToken,
} from "@/features/authentication/slice/auth";
import { CountryCode } from "@/lib/countryCodes";
import { useRouter } from "next/navigation";
import Modal from "@/components/reusable-uis/Modal";
import Smile from "@/components/icons/Smile";
import makeClient from "@/lib/apollo/apolloProvider";
import CircularProgress from "@/components/icons/CircularProgress";
import ReCAPTCHA from "react-google-recaptcha";
// import OtpButton from "@/features/authentication/components/RenderOtpBtns";

const OtpModal = dynamic(
  () => import("../../authentication/components/OtpModal"),
  {
    ssr: false,
  }
);
const OtpButton = dynamic(
  () => import("@/features/authentication/components/RenderOtpBtns"),
  {
    ssr: false,
  }
);

const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || "";

function WholesaleRegistration() {
  // hooks
  const customer = useAppSelector((state) => state.auth.value);

  // states
  const [mailAvailable, setMailAvailable] = useState(true);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [fileName, setFileName] = useState<null | string>(null);
  const [mobileNumberCountryCode, setMobileNumberCountryCode] =
    useState<CountryCode>("AE");
  const [pageLoading, setPageLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // const [passVisiblty, setPassVisiblty] = useState<{
  //   pass: boolean;
  //   cPass: boolean;
  // }>({ cPass: false, pass: false });
  const {
    registrationInitialValues,
    registrationValidationSchema,
    refineProofData,
  } = useWholesaleRegistration({ mailAvailable, isOtpVerified, customer });
  const {
    requestOtpCustomer: [requestOtpCustomer, requestOtpCustomerStatus],
  } = useAuth();
  const {
    createWholesaler: [createWholesaler, createWholesalerStatus],
  } = useWholesaler();
  const { formatTime, blockUserTiming, isBlocked, storeToLocalStorage } =
    useBlocking();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();

  // states
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);

  const registrationForm = useFormik({
    initialValues: registrationInitialValues,
    validationSchema: registrationValidationSchema,
    async onSubmit(values, formikHelpers) {
      if (!captchaToken) {
        toast({
          title: "Ooops!!",
          description: "Please complete the reCAPTCHA",
          variant: "error",
        });
        return;
      }

      try {
        const response = await fetch("/api/verify-captcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: captchaToken }),
        });

        const data = await response.json();

        if (data.success) {
          const {
            email,
            firstname,
            lastname,
            mobile,
            password,
            proof,
            company,
            license_num,
          } = values;
          const cleanedNumber = mobile.replace(/\+/g, "");
          const registrationInput: CreateWholesalerAccountType["Variables"] = {
            input: {
              firstname,
              lastname,
              email,
              password,
            },
            companyName: company,
            customerProof: {
              base64_data: proof ? refineProofData(proof) : "",
              file_name: fileName ? fileName : "",
            },
            licenceNumber: license_num,
            mobileNumber: cleanedNumber,
            websiteId: 1,
          };
          // console.log("proof base64", registrationInput.customerProof.base64_data);
          createWholesaler({
            variables: registrationInput,
            onCompleted(data, clientOptions) {
              if (
                // data.createWholesalerAccount.customer?.token &&
                data.createWholesalerAccount.status
              ) {
                // dispatch(updateToken(data.createWholesalerAccount.customer.token));
                // dispatch(updateCustomer(data.createWholesalerAccount.customer));

                // toast({
                //   title: "User Registration",
                //   description:
                //     data.createWholesalerAccount.message ||
                //     "User created succesfully",
                //   variant: "success",
                // });
                setVerificationMsg(
                  "To complete your registration, please confirm your email by clicking the link we’ve sent to your inbox."
                );
                setVerificationModalOpen(true);
              }
              if (!data.createWholesalerAccount.status) {
                toast({
                  title: "User Registration",
                  description: data.createWholesalerAccount.message || "Ooops",
                  variant: "error",
                });
              }
            },
          });
        } else {
          toast({
            title: "Ooops!!",
            description: "Captcha verification failed. Please try again.",
            variant: "error",
          });
        }
      } catch (err) {
        throw err;
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true
  });

  const onVarified = ({ flag, otp }: { flag: boolean; otp?: string }) => {
    setIsOtpVerified(flag);
    if (flag) {
      registrationForm.setFieldValue("otp", otp);
      setIsOtpVerified(true);
    }
  };

  const requestOtp = () => {
    const cleanedMobile = registrationForm.values.mobile.replace(/\+/g, "");
    if (!isBlocked) {
      requestOtpCustomer({
        variables: {
          isresend: false,
          mobileNumber: cleanedMobile,
          websiteId: 1,
        },
        onCompleted(data, clientOptions) {
          if (data.createAccountOTP.response) {
            const decodedResponse = JSON.parse(
              data.createAccountOTP.response as string
            ) as { status: boolean; message: string }[];
            // console.log("decoded response", decodedResponse?.[0].status);
            if (decodedResponse?.[0].status) {
              toast({
                title: "Request OTP",
                description:
                  decodedResponse?.[0].message || "OTP has been send",
                variant: "success",
              });
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
  const handleVerificationModalOpen = () => {
    setVerificationModalOpen((prev) => {
      if (prev) {
        setPageLoading(true);
        dispatch(
          fetchCustomer({
            client: makeClient(),
            onSuccess(customerData) {
              setPageLoading(false);
              router.push(`/?signin=dgc-login`);
            },
            onFailure(error) {
              setPageLoading(false);
            },
          })
        );
      }
      return !prev;
    });
  };
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  // const onPassVisibltyChange = (type: "pass" | "cPass") => {
  //   if (type === "pass") {
  //     setPassVisiblty((prev) => ({
  //       ...prev,
  //       pass: !prev.pass,
  //     }));
  //   } else {
  //     setPassVisiblty((prev) => ({
  //       ...prev,
  //       cPass: !prev.cPass,
  //     }));
  //   }
  // };

  // Trigger formik validation manually when `isMobileValid` or `isOtpVerified` changes
  // useEffect(() => {
  //   if (isOtpVerified) registrationForm.validateForm();
  // }, [isOtpVerified]);

  // useEffect(() => {
  //   if (mobileNumberCountryCode !== "AE") {
  //     registrationForm.setFieldValue("otp", 849392);
  //     setIsOtpVerified(true);
  //   } else {
  //     setIsOtpVerified(false);
  //     registrationForm.setFieldValue("otp", null);
  //   }
  // }, [mobileNumberCountryCode]);

  // useEffect(() => {
  //   if (customer?.token) {
  //     setPageLoading(true);
  //     dispatch(
  //       fetchCustomer({
  //         client: makeClient(),
  //         onSuccess(customerData) {
  //           setPageLoading(false);
  //         },
  //         onFailure(error) {
  //           setPageLoading(false);
  //         },
  //       })
  //     );
  //   }
  // }, [customer?.token]);

  // console.log("customer intial values", registrationInitialValues);
  // console.log("form values", registrationForm.values);

  if (pageLoading)
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <CircularProgress width={60} />
        <p className=" text-h3 font-500">Please wait..</p>
      </div>
    );

  return (
    <div className={`registration_client ${styles.registration_client}`}>
      <form className="signup" onSubmit={registrationForm.handleSubmit}>
        <div className="input_grup">
          <label htmlFor="firstname">First name. *</label>
          <Input
            type="text"
            placeholder="First name"
            name="firstname"
            value={registrationForm.values["firstname"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["firstname"] &&
              registrationForm.touched["firstname"]
            }
            errorTxt={registrationForm.errors["firstname"]}
            disabled={!!customer?.firstname}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="lastname">Last name. *</label>
          <Input
            type="text"
            placeholder="Last name"
            name="lastname"
            value={registrationForm.values["lastname"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["lastname"] &&
              registrationForm.touched["lastname"]
            }
            errorTxt={registrationForm.errors["lastname"]}
            disabled={!!customer?.lastname}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="company">Company Name. *</label>
          <Input
            type="text"
            placeholder="Company name"
            name="company"
            value={registrationForm.values["company"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["company"] &&
              registrationForm.touched["company"]
            }
            errorTxt={registrationForm.errors["company"]}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="email">Email. *</label>
          <Input
            type="text"
            placeholder="Email address..."
            name="email"
            value={registrationForm.values["email"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["email"] &&
              registrationForm.touched["email"]
            }
            errorTxt={registrationForm.errors["email"]}
            disabled={!!customer?.email}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="license_num">License Number.*</label>
          <Input
            type="text"
            placeholder="License Number"
            name="license_num"
            value={registrationForm.values["license_num"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["license_num"] &&
              registrationForm.touched["license_num"]
            }
            errorTxt={registrationForm.errors["license_num"]}
          />
        </div>
        {/* mobile and file */}
        <div className="input_grup">
          <label htmlFor="mobile">Mobile No. *</label>
          <div className="phone_wrap">
            <div className="code">
              {"+" + getCountryCallingCode(mobileNumberCountryCode)}
            </div>
            <PhoneInput
              name="mobile"
              defaultCountry={mobileNumberCountryCode}
              placeholder="Mobile number"
              value={registrationForm.values["mobile"]}
              onChange={(value) => {
                registrationForm
                  .setFieldValue("mobile", value || "")
                  .then(() => {
                    registrationForm.validateForm();
                  });
              }}
              onCountryChange={(country) => {
                if (country) {
                  setMobileNumberCountryCode(country);
                }
              }}
              onBlur={registrationForm.handleBlur}
              international={false}
              countryCallingCodeEditable={false}
              disabled={!!customer?.mobilenumber}
            />
            {/* {registrationForm.values["mobile"] &&
            mobileNumberCountryCode === "AE" ? (
              <OtpButton
                isOtpVerified={isOtpVerified}
                requestOtp={requestOtp}
                requestOtpCustomerStatus={requestOtpCustomerStatus}
                registrationFormErrors={registrationForm.errors}
              />
            ) : null} */}

            {registrationForm.errors["mobile"] &&
            registrationForm.touched["mobile"] ? (
              <div className="error">
                <p>{registrationForm.errors["mobile"]}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="input_grup">
          <label htmlFor="proof">Upload ID card. *</label>
          <FileUploadButton
            onFileSelect={(file) => {
              setFileName(file.filename);
              registrationForm.setFieldValue("proof", file.base64File);
            }}
            error={
              !!registrationForm.errors["proof"] &&
              registrationForm.touched["proof"]
            }
            errorTxt={registrationForm.errors["proof"]}
          />
          {/* <Input
            type="file"
            name="proof"
            placeholder="upload jpeg, png, pdf, docx"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0] || null;
              registrationForm.setFieldValue("proof", file);
            }}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["proof"] &&
              registrationForm.touched["proof"]
            }
            errorTxt={registrationForm.errors["proof"]}
          /> */}
        </div>
        {/* --- */}
        {/* <div className="input_grup">
          <label htmlFor="password">Password. *</label>
          <Input
            type={passVisiblty["pass"] ? "text" : "password"}
            placeholder="password"
            name="password"
            value={registrationForm.values["password"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["password"] &&
              registrationForm.touched["password"]
            }
            errorTxt={registrationForm.errors["password"]}
          />
          <Button
            className="visiblity"
            variant={"itself"}
            onClick={() => onPassVisibltyChange("pass")}
          >
            {passVisiblty["pass"] ? (
              <Eye stroke="#a5a5a5" />
            ) : (
              <EyeOff stroke="#a5a5a5" />
            )}
          </Button>
        </div>
        <div className="input_grup">
          <label htmlFor="confirmPassword">Confirm Password. *</label>
          <Input
            type={passVisiblty["cPass"] ? "text" : "password"}
            placeholder="confirm password"
            name="confirmPassword"
            value={registrationForm.values["confirmPassword"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["confirmPassword"] &&
              registrationForm.touched["confirmPassword"]
            }
            errorTxt={registrationForm.errors["confirmPassword"]}
          />
          <Button
            className="visiblity"
            variant={"itself"}
            onClick={() => onPassVisibltyChange("cPass")}
          >
            {passVisiblty["cPass"] ? (
              <Eye stroke="#a5a5a5" />
            ) : (
              <EyeOff stroke="#a5a5a5" />
            )}
          </Button>
        </div> */}

        <div className="terms">
          <p>
            By continuing, I agree to the{" "}
            <Link href={`/terms-conditions`}>Terms of Use</Link> &{" "}
            <Link href={`/privacy-policy`}>Privacy Policy</Link>
          </p>
        </div>
        <div className="google_recaptcha_btn pb-4">
          <ReCAPTCHA
            sitekey={SITE_KEY}
            onChange={handleCaptchaChange}
            onExpired={() => setCaptchaToken(null)} // Optional: Handle token expiration
          />
        </div>
        <div className="input_grup">
          <Button
            type="submit"
            variant={"itself"}
            className="w-full submit_btn text-pcard_price normal_btn"
            onSubmit={(e) => {
              e.preventDefault();
              registrationForm.handleSubmit();
            }}
            disabled={createWholesalerStatus.loading}
          >
            {createWholesalerStatus.loading ? (
              <LoaderCircle className="animate-spin" />
            ) : null}
            <span>CONTINUE</span>
          </Button>
        </div>
        {/* <div className="no_account">
          <p>
            Already have an account?{" "}
            <Link href={"/register?signin=dgc-login"}>Login here</Link>
          </p>
        </div> */}
      </form>

      <OtpModal
        isOpen={otpModalOpen}
        setIsOpen={setOtpModalOpen}
        mobile={registrationForm.values["mobile"]}
        setFieldValue={registrationForm.setFieldValue}
        onVarified={onVarified}
        verifyType="register"
      />
      <Modal
        isOpen={verificationModalOpen}
        setIsOpen={handleVerificationModalOpen}
        notCloseOnOutside={true}
        className="order_complete_modal"
      >
        <div className={`common_success_content ${styles.order_completed}`}>
          <div className="inner">
            <Smile />
            <h2 className="text-h2">Welcome To DGC!</h2>
            {/* <Link
              href={"/"}
              onClick={(e) => {
                
              }}
            >
              Verification Needed.
            </Link> */}
            <p>
              <span className=" font-600">{verificationMsg}</span>
            </p>
            {/* <Link
              href={"/"}
              onClick={(e) => {
                e.preventDefault();
                router.push(`/?signin=dgc-login`);
              }}
              className="continue"
            >
              CONTINUE TO LOGIN
            </Link> */}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default WholesaleRegistration;
