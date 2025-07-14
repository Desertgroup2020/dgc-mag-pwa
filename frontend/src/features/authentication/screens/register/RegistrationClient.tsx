"use client";

import React, { useEffect, useState } from "react";
import styles from "../../styles/register.module.scss";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PhoneInput, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  Value,
  getCountryCallingCode,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useFormik } from "formik";
import useRegistration from "../../hooks/useRegistration";
import dynamic from "next/dynamic";
import useAuth from "../../hooks/useAuth";
import { LoaderCircle } from "lucide-react";
import { useBlocking } from "../../components/blockingContext";
import { useAppDispatch } from "@/redux/hooks";
import { updateCustomer, updateToken } from "../../slice/auth";
import { withoutAuth } from "@/hocs/ProtectedRoutes";
import { useToast } from "@/components/ui/use-toast";
import { CountryCode } from "@/lib/countryCodes";
import Modal from "@/components/reusable-uis/Modal";
import { useRouter } from "next/navigation";
import Smile from "@/components/icons/Smile";
import ReCAPTCHA from "react-google-recaptcha";
// import OtpButton from "../../components/RenderOtpBtns";

const OtpModal = dynamic(() => import("../../components/OtpModal"), {
  ssr: false,
});
const OtpButton = dynamic(() => import("../../components/RenderOtpBtns"), {
  ssr: false,
  loading: () => <LoaderCircle className="animate-spin" />,
});

const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || "";

function RegistrationClient() {
  const [mailAvailable, setMailAvailable] = useState(true);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [mobileNumberCountryCode, setMobileNumberCountryCode] =
    useState<CountryCode>("AE");
  const { registrationInitialValues, registrationValidationSchema } =
    useRegistration({ mailAvailable, isOtpVerified });
  const {
    requestOtpCustomer: [requestOtpCustomer, requestOtpCustomerStatus],
    createCustomerWithOtp: [createCustomerWithOtp, createCustomerWithOtpStatus],
    subscribeEmailToNewsletter: [
      subscribeEmailToNewsletter,
      subscribeEmailToNewsletterStatus,
    ],
  } = useAuth();
  const { formatTime, blockUserTiming, isBlocked, storeToLocalStorage } =
    useBlocking();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();

  // states
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // features
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
            otp,
            password,
            newsletter,
          } = values;
          const cleanedNumber = mobile.replace(/\+/g, "");

          if (newsletter) {
            subscribeEmailToNewsletter({
              variables: {
                email,
              },
            });
          }
          createCustomerWithOtp({
            variables: {
              mobileNumber: cleanedNumber,
              otp: otp,
              input: {
                email: email,
                firstname: firstname,
                lastname: lastname,
                password: password,
              },
              websiteId: 1,
            },
            onCompleted(data, clientOptions) {
              if (data.createCustomerAccount.status) {
                // dispatch(updateToken(data.createCustomerAccount.customer.token));
                // dispatch(updateCustomer(data.createCustomerAccount.customer));

                // toast({
                //   title: "User Registration",
                //   description:
                //     data.createCustomerAccount.message ||
                //     "User created succesfully",
                //   variant: "success",
                // });

                setVerificationMsg(
                  "To complete your registration, please confirm your email by clicking the link we’ve sent to your inbox."
                );
                setVerificationModalOpen(true);
              }
              if (!data.createCustomerAccount.status) {
                toast({
                  title: "User Registration",
                  description: data.createCustomerAccount.message || "Ooops",
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
      storeToLocalStorage().then((otpCount) => {
        console.log("otp count", otpCount);

        if (otpCount < 4) {
          requestOtpCustomer({
            variables: {
              isresend: false,
              mobileNumber: cleanedMobile,
              websiteId: 1,
            },
            onCompleted(data, clientOptions) {
              if (data.createAccountOTP.response) {
                const decodedResponse = JSON.parse(
                  data.createAccountOTP.response
                ) as { status: boolean; message: string }[];

                if (decodedResponse?.[0].status) {
                  setOtpModalOpen(true);
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
      });
    } else {
      setOtpModalOpen(true);
    }
  };

  const handleVerificationModalOpen = () => {
    setVerificationModalOpen((prev) => {
      if (prev) {
        router.push(`/?signin=dgc-login`);
      }
      return !prev;
    });
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  // Trigger formik validation manually when `isMobileValid` or `isOtpVerified` changes
  useEffect(() => {
    if (isOtpVerified) registrationForm.validateForm();
  }, [isOtpVerified]);
  useEffect(() => {
    if (mobileNumberCountryCode !== "AE") {
      registrationForm.setFieldValue("otp", 849392);
      setIsOtpVerified(true);
    } else {
      setIsOtpVerified(false);
      registrationForm.setFieldValue("otp", null);
    }
  }, [mobileNumberCountryCode]);

  return (
    <div className={`registration_client ${styles.registration_client}`}>
      {/* <button onClick={() => setOtpModalOpen(true)}>testing counter</button> */}
      <form className="signup" onSubmit={registrationForm.handleSubmit}>
        <div className="input_grup">
          <label htmlFor="firstname">First name*</label>
          <Input
            type="text"
            placeholder="Enter your first name..."
            name="firstname"
            value={registrationForm.values["firstname"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["firstname"] &&
              registrationForm.touched["firstname"]
            }
            errorTxt={registrationForm.errors["firstname"]}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="lastname">Last name*</label>
          <Input
            type="text"
            placeholder="Enter your last name..."
            name="lastname"
            value={registrationForm.values["lastname"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["lastname"] &&
              registrationForm.touched["lastname"]
            }
            errorTxt={registrationForm.errors["lastname"]}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="email">Email.*</label>
          <Input
            type="text"
            placeholder="Enter your email address..."
            name="email"
            value={registrationForm.values["email"]}
            onChange={registrationForm.handleChange}
            onBlur={registrationForm.handleBlur}
            error={
              !!registrationForm.errors["email"] &&
              registrationForm.touched["email"]
            }
            errorTxt={registrationForm.errors["email"]}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="mobile">Mobile No.*</label>
          <div className="phone_wrap">
            <div className="code">
              {"+" + getCountryCallingCode(mobileNumberCountryCode)}
            </div>
            <PhoneInput
              name="mobile"
              defaultCountry={mobileNumberCountryCode}
              // placeholder="Enter your mobile number..."
              placeholder="XX-1234567"
              value={registrationForm.values["mobile"]}
              onChange={(value) => {
                registrationForm
                  .setFieldValue("mobile", value || "")
                  .then(() => {
                    registrationForm.validateForm();
                  });
              }}
              onCountryChange={(country) => {
                console.log("country from register phone", country);
                if (country) {
                  setMobileNumberCountryCode(country);
                }
              }}
              onBlur={registrationForm.handleBlur}
              international={false}
              countryCallingCodeEditable={false}
            />
            {registrationForm.values["mobile"] &&
            mobileNumberCountryCode === "AE" ? (
              <OtpButton
                isOtpVerified={isOtpVerified}
                requestOtp={requestOtp}
                requestOtpCustomerStatus={requestOtpCustomerStatus}
                registrationFormErrors={registrationForm.errors}
              />
            ) : null}

            {registrationForm.errors["mobile"] &&
            registrationForm.touched["mobile"] ? (
              <div className="error">
                <p>{registrationForm.errors["mobile"]}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="input_grup checkbox">
          <label htmlFor="newsletter" className="!flex gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="newsletter"
              id="newsletter"
              checked={registrationForm.values.newsletter}
              onChange={registrationForm.handleChange}
            />
            <span>Subscribe to news letter</span>
          </label>
        </div>
        {/* <div className="input_grup">
          <label htmlFor="referral">I have referral code (optional)</label>
          <Input type="text" placeholder="Referral Code" name="referral" />
        </div> */}
        <div className="terms">
          <p>
            By continuing, I agree to the{" "}
            <Link href={`/terms-condition`} target="_blank">
              Terms of Use
            </Link>{" "}
            &{" "}
            <Link href={`/privacy-policy`} target="_blank">
              Privacy Policy
            </Link>
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
            disabled={createCustomerWithOtpStatus.loading}
          >
            {createCustomerWithOtpStatus.loading ? (
              <LoaderCircle className="animate-spin" />
            ) : null}
            <span>CONTINUE</span>
          </Button>
        </div>
        <div className="no_account">
          <p>
            Already have an account?{" "}
            <Link href={"/register?signin=dgc-login"}>Login here</Link>
          </p>
        </div>
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

export default withoutAuth(RegistrationClient);
