import React, { useState } from "react";
import styles from "../../styles/email_login.module.scss";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import useLogin from "../../hooks/useLogin";
import { Button } from "@/components/ui/button";
import "react-phone-number-input/style.css";
import Link from "next/link";
import { useLoginContext } from "../../components/loginContext";
import { LoaderCircle } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "@/components/ui/use-toast";
import { useBlocking } from "../../components/blockingContext";
import { formatTime } from "@/utils";

const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || "";

function LoginClient() {
  const { loginFormInitialValues, loginFormValidationSchema } = useLogin();
  const isRouteChanging = useAppSelector((state) => state.window.routeChanging);
  const {
    requestOtpForEmail,
    requestingOtp,
    setIsMobileOtp,
    requestOtpForMobile,
  } = useLoginContext();
  const { toast } = useToast();
  const { isBlocked, blockUserTiming } = useBlocking();
  // states
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // features
  const loginForm = useFormik({
    initialValues: loginFormInitialValues,
    validationSchema: loginFormValidationSchema,
    async onSubmit(values, formikHelpers) {
      // recaptcha

      // if (!captchaToken) {
      //   toast({
      //     title: "Ooops!!",
      //     description: "Please complete the reCAPTCHA",
      //     variant: "error",
      //   });
      //   return;
      // }
      // try {
      //   const response = await fetch("/api/verify-captcha", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ token: captchaToken }),
      //   });

      //   const data = await response.json();

      //   if (data.success) {
      //     // alert("Captcha verified! Proceeding...");
      //     // Handle form submission
      //     if (values.email) {
      //       // Call email mutation
      //       setIsMobileOtp(false);
      //       requestOtpForEmail(values.email);
      //     } else if (values.mobile) {
      //       // Call phone mutation
      //       const cleanedNumber = values.mobile.replace(/\+/g, "");
      //       setIsMobileOtp(true);
      //       requestOtpForMobile(cleanedNumber);
      //     }
      //   } else {
      //     toast({
      //       title: "Ooops!!",
      //       description: "Captcha verification failed. Please try again.",
      //       variant: "error",
      //     });
      //   }
      // } catch (err) {
      //   throw err;
      // }

      if (values.email) {
        // Call email mutation
        setIsMobileOtp(false);
        requestOtpForEmail(values.email);
      } else if (values.mobile) {
        // Call phone mutation
        const cleanedNumber = values.mobile.replace(/\+/g, "");
        setIsMobileOtp(true);
        requestOtpForMobile(cleanedNumber);
      }
    },
  });
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  // console.log("SITE_KEY", SITE_KEY);

  return (
    <div className={`email_login ${styles.email_login}`}>
      <h3>Login with phone no or email address*</h3>
      <div className="form_screen">
        <form onSubmit={loginForm.handleSubmit} className="login_form">
          <div className="input_grup">
            <label htmlFor="mobile">Mobile No.*</label>
            <div className="phone_wrap">
              <div className="code">{"+" + getCountryCallingCode("AE")}</div>
              <PhoneInput
                name="mobile"
                defaultCountry="AE"
                placeholder="XX-1234567"
                value={loginForm.values["mobile"]}
                onChange={(value) => {
                  loginForm.setFieldValue("mobile", value || "");
                }}
                disabled={!!loginForm.values.email || isRouteChanging}
                onBlur={loginForm.handleBlur}
                international={false}
                countryCallingCodeEditable={false}
              />

              {loginForm.errors["mobile"] ? (
                <div className="error">
                  <p>{loginForm.errors["mobile"]}</p>
                </div>
              ) : null}
            </div>
          </div>
          <span className="suppurator text-h3 font-600">OR</span>
          <div className="input_grup">
            <label htmlFor="email">Email.*</label>
            <Input
              type="text"
              placeholder="Enter your email address..."
              name="email"
              value={loginForm.values["email"]}
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
              error={!!loginForm.errors["email"] && loginForm.touched["email"]}
              errorTxt={loginForm.errors["email"]}
              disabled={!!loginForm.values.mobile || isRouteChanging}
            />
          </div>
          <div className="terms">
            <p>
              By continuing, I agree to the{" "}
              <Link href={`/terms-conditions`}>Terms of Use</Link> &{" "}
              <Link href={`/privacy-policy`}>Privacy Policy</Link>
            </p>
          </div>
          {/* <div className="google_recaptcha_btn pb-4">
            <ReCAPTCHA
              sitekey={SITE_KEY}
              onChange={handleCaptchaChange}
              onExpired={() => setCaptchaToken(null)} // Optional: Handle token expiration
            />
          </div> */}
          <div className="input_grup">
            <Button
              type="submit"
              variant={"itself"}
              className="w-full submit_btn text-pcard_price normal_btn"
              disabled={requestingOtp || isRouteChanging || isBlocked}
            >
              {requestingOtp ? <LoaderCircle className="animate-spin" /> : null}
              <span>
                {isBlocked
                  ? `Try after ${formatTime(
                      (!!blockUserTiming && blockUserTiming) || 0
                    )}`
                  : "GET OTP"}
              </span>
            </Button>
          </div>
        </form>
      </div>
      <div className="no_account">
        <p>
          Don’t have an account? <Link href={"/register"}>Signup here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginClient;
