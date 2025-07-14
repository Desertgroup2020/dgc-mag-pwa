import { gql } from "@apollo/client";
import { customerFragment, customerFragmentWithoutReward } from "./fragments";
import {
  CustomerInput,
  CustomerToken,
  MobileCreateCustomerAccountOutput,
  OtpRequestInput,
  OtpRequestOutput,
  Response,
} from "@/generated/types";

//user registartion
export const CREATE_CUSTOMER_ACCOUNT = gql`
  mutation createCustomerAccount(
    $input: CustomerInput!
    $mobileNumber: String
    $otp: String
    $websiteId: Int
  ) {
    createCustomerAccount(
      input: $input
      mobileNumber: $mobileNumber
      otp: $otp
      websiteId: $websiteId
    ) {     
      message
      status
    }
  }
`;
export const REQUEST_ACCOUNT_OTP = gql`
  mutation requestAccountOtp(
    $mobileNumber: String
    $websiteId: Int
    $isresend: Boolean
  ) {
    createAccountOTP(
      mobileNumber: $mobileNumber
      websiteId: $websiteId
      isresend: $isresend
    ) {
      data
      response
      status
    }
  }
`;
export const ACCOUNT_OTP_VERIFY = gql`
  mutation accountOtpVerify(
    $mobileNumber: String
    $otp: String
    $websiteId: Int
  ) {
    createAccountOTPVerify(
      mobileNumber: $mobileNumber
      otp: $otp
      websiteId: $websiteId
    ) {
      data
      response
      status
    }
  }
`;

export type CreateCustomerAccountType = {
  Response: {
    createCustomerAccount: MobileCreateCustomerAccountOutput;
  };
  Variables: {
    input: CustomerInput;
    mobileNumber: string;
    otp: string;
    websiteId: number;
  };
};
export type RequestAccountOtpType = {
  Response: {
    createAccountOTP: Response;
  };
  Variables: {
    mobileNumber: string;
    websiteId: number;
    isresend: boolean;
  };
};
export type AccountOtpVerifyType = {
  Response: {
    createAccountOTPVerify: Response;
  };
  Variables: {
    mobileNumber: string;
    otp: string;
    websiteId: number;
  };
};
// === ---- ===

// login with email
export const GENERATE_CUSTOMER_TOKEN_EMAIL = gql`
  mutation generateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;
export const REQUEST_OTP_EMAIL_LOGIN = gql`
  mutation requestOtpForEmailLogin($input: OtpRequestInput) {
    generateAndSendOtp(input: $input) {
      response
    }
  }
`;

export type GenerateCustomerTokenEmailType = {
  Variables: {
    email: string;
    password: string;
  };
  Response: {
    generateCustomerToken: CustomerToken;
  };
};
export type RequestOtpForEmailLoginType = {
  Variables: {
    input: OtpRequestInput;
  };
  Response: {
    generateAndSendOtp: OtpRequestOutput;
  };
};
// === ---- ===
// login with mobile
export const REQUEST_OTP_FOR_MOBILE = gql`
  mutation requestOtpForMobile(
    $mobileNumber: String
    $websiteId: Int
    $isresend: Boolean
  ) {
    loginOTP(
      mobileNumber: $mobileNumber
      websiteId: $websiteId
      isresend: $isresend
    ) {
      data
      response
      status
    }
  }
`;
export const VERIFY_MOBILE_OTP = gql`
  mutation verifyMobileOtp(
    $mobileNumber: String
    $otp: String
    $websiteId: Int
  ) {
    loginOTPVerify(
      mobileNumber: $mobileNumber
      otp: $otp
      websiteId: $websiteId
    ) {
      data
      response
      status
    }
  }
`;

export type RequestOtpForMobile = {
  Response: {
    loginOTP: Response;
  };
  Variables: {
    mobileNumber: string;
    websiteId: number;
    isresend: boolean;
  };
};
export type VerifyMobileOtp = {
  Response: {
    loginOTPVerify: Response
  },
  Variables: {
    mobileNumber: string,
    otp: string,
    websiteId: number
  }
}
// === ---- ===
