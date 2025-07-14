import * as Yup from "yup";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { mailRegx } from "@/lib/regexes";
import { phoneValidRegx } from "@/components/address/useAddressForm";
import { CommonEmailRegex } from "@/features/hot/components/HotForm";

interface Props {
  mailAvailable?: boolean;
  isMobileValid?: boolean;
  isOtpVerified?: boolean;
}
export interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
function useRegistration({
  mailAvailable,
  isMobileValid,
  isOtpVerified,
}: Props) {
  const registrationInitialValues = {
    firstname: "",
    lastname: "",
    email: "",
    otp: "",
    mobile: "",
    password: "#Admin123",
    confirmPassword: "#Admin123",
    newsletter: true
  };

  // console.log("is valid mobile", isMobileValid);
  const validateMobile = function (this: Yup.TestContext, value: string) {
    if (!isOtpVerified) {
      return this.createError({
        path: this.path,
        message: "Please verify the mobile number",
      });
    }
    return true;
  };

  const registrationValidationSchema = useMemo(
    () =>
      Yup.object().shape({
        firstname: Yup.string()
          .min(3, "Name is too short")
          .max(60, "Name is too long")
          .required("First name is required"),
        lastname: Yup.string().required("Last name is required"),
        email: Yup.string()
          .matches(CommonEmailRegex, "Invalid email")
          .required("Email is required")
          .test(
            "is-mail-available",
            "Email is already in use",
            function (value) {
              // Use the state to determine whether the email is available or not.
              return mailAvailable || false;
            }
          ),
        //need to change accordingly
        mobile: Yup.string()
          .required("Mobile number is required")
          .matches(phoneValidRegx, "Mobile number is not valid")
          .test("validate-mobile", "", validateMobile),
        // need to change accordingly
        otp: Yup.number().required("OTP is required"),
      }),
    [mailAvailable, isMobileValid, isOtpVerified]
  );

  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string().required().min(6).max(6),
  });

  return {
    registrationInitialValues,
    registrationValidationSchema,
    otpValidationSchema,
    validateMobile
  };
}

export default useRegistration;
