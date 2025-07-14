import * as Yup from "yup";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { mailRegx } from "@/lib/regexes";
import { phoneValidRegx } from "@/components/address/useAddressForm";
import { CommonEmailRegex } from "@/features/hot/components/HotForm";
import { Customer } from "@/generated/types";
import { parsePhoneNumber } from "react-phone-number-input";
import { useAppSelector } from "@/redux/hooks";

interface Props {
  mailAvailable?: boolean;
  isMobileValid?: boolean;
  isOtpVerified?: boolean;
  customer?: Customer | null;
}
export interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  otp: string;
  password: string;
  confirmPassword: string;
  proof: File | null;
}

function useWholesaleRegistration({
  mailAvailable,
  isMobileValid,
  isOtpVerified,
  customer
}: Props) {
  // const customer = useAppSelector((state) => state.auth.value);
  const customerMobile = useMemo(() => customer?.mobilenumber, [customer]);
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "application/pdf"];
  const extractMimeType = (base64String: string): string | null => {
    const match = base64String.match(/^data:(.*?);base64,/);
    return match ? match[1] : null;
  };
  const calculateFileSizeInMB = (base64String: string): number => {
    const stringLength = base64String.length - "data:image/png;base64,".length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    return sizeInBytes / (1024 * 1024); // convert bytes to MB
  };

  const registrationInitialValues = useMemo(()=> ({
    firstname: customer?.firstname || "",
    lastname: customer?.lastname || "",
    company: "",
    email: customer?.email || "",
    license_num: "",
    // otp: "849392",
    mobile: parsePhoneNumber(`+${customerMobile}`)?.number || "",
    password: "@Dgc123456",
    confirmPassword: "@Dgc123456",
    proof: null, // Add this line
  }), [customer?.email, customer?.firstname, customer?.lastname, customerMobile]);

  // console.log("is valid mobile", isMobileValid);
  const validateMobile = function (this: Yup.TestContext, value: string) {
    if (!isOtpVerified) {
      return this.createError({
        path: this.path,
        message: "Please verify the mobile",
      });
    }
    return true;
  };
  const passwordRules = Yup.string().required("Password is required");
  // .min(8, "Password must be at least 8 characters")
  // .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
  // .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  // .matches(/\d/, "Password must contain at least 1 number")
  // .matches(
  //   /[@$!%*?&#]/,
  //   "Password must contain at least 1 special character"
  // );

  const registrationValidationSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(3, "Name is too short")
      .max(60, "Name is too long")
      .required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    company: Yup.string().required("Company name is required"),
    license_num: Yup.string().required("License Number is required"),
    email: Yup.string()
      .matches(CommonEmailRegex, "Invalid email")
      .required("Email is required")
      .test("is-mail-available", "Email is already in use", function (value) {
        // Use the state to determine whether the email is available or not.
        return mailAvailable || false;
      }),
    //need to change accordingly
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(phoneValidRegx, "Mobile number is not valid"),
      // .test("validate-mobile", "", validateMobile),
    // need to change accordingly
    // otp: Yup.number().required("OTP is required"),
    proof: Yup.string()
      .required("File is required")
      .test("fileFormat", "Unsupported file format", (value: unknown) => {
        if (!value || typeof value !== "string") return false; // Required validation
        const mimeType = extractMimeType(value);
        return mimeType ? SUPPORTED_FORMATS.includes(mimeType) : false;
      })
      .test(
        "fileSize",
        "File size too large. Maximum size is 4MB.",
        (value: unknown) => {
          if (!value || typeof value !== "string") return false; // Required validation
          const fileSize = calculateFileSizeInMB(value);
          return fileSize <= 2;
        }
      ),
    // password: passwordRules,
    // confirmPassword: Yup.string()
    //   .required("Confirm Password is required")
    //   .oneOf([Yup.ref("password")], "Passwords must match")
    //   .min(8, "Password must be at least 8 characters")
    //   .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
    //   .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    //   .matches(/\d/, "Password must contain at least 1 number")
    //   .matches(
    //     /[@$!%*?&#]/,
    //     "Password must contain at least 1 special character"
    //   ),
  });

  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string().required().min(6).max(6),
  });

  const refineProofData = (base64String: string) => {
    let refinedBase64String = base64String;
    // Strip the prefix if it exists
    const base64PrefixIndex = base64String.indexOf("base64,");
    if (base64PrefixIndex !== -1) {
      refinedBase64String = base64String.substring(base64PrefixIndex + 7);
    }

    return refinedBase64String;
  };  
  

  return {
    registrationInitialValues,
    registrationValidationSchema,
    otpValidationSchema,
    refineProofData,
  };
}

export default useWholesaleRegistration;
