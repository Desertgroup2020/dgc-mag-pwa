import { CommonEmailRegex } from "@/features/hot/components/HotForm";
import React from "react";
import * as Yup from "yup";

function useLogin() {
  const loginFormValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .matches(CommonEmailRegex, "Invalid email")
      .test("email-or-phone", "Email is required", function (value) {
        const { mobile } = this.parent;
        return mobile || value;
      }),
    mobile: Yup.string()
      .min(13, "Invalid Phone")
      .max(13, "Invalid Phone")
      //   .matches(/^\d+$/, "Phone number must be digits only")
      .test("email-or-phone", "Phone number is required", function (value) {
        const { email } = this.parent;
        return email || value;
      }),
  });

  const loginFormInitialValues = { email: "", mobile: "" };

  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string().required().min(6).max(6),
  });


  return {
    loginFormInitialValues,
    loginFormValidationSchema,
    otpValidationSchema
  };
}

export default useLogin;
