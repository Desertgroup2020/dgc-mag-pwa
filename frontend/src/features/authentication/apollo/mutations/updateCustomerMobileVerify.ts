import { Response } from "@/generated/types";
import { gql } from "@apollo/client";

const UPDATE_CUSTOMER_MOBILE_OTP_VERIFY = gql`
  mutation updateMobileNumberOTPVerify(
    $newmobileNumber: String
    $customerId: String
    $otp: String
    $oldmobileNumber: String
    $websiteId: Int
  ) {
    updateMobileNumberOTPVerify(
      newmobileNumber: $newmobileNumber
      customerId: $customerId
      otp: $otp
      oldmobileNumber: $oldmobileNumber
      websiteId: $websiteId
    ) {
      data
      response
      status
    }
  }
`;

export type UpdateCustomerMobileOtpVerifyType = {
  Response: {
    updateMobileNumberOTPVerify: Response;
  };
  Variables: {
    newmobileNumber: string;
    customerId: string;
    otp: string;
    oldmobileNumber: string;
    websiteId: number;
  };
};

export default UPDATE_CUSTOMER_MOBILE_OTP_VERIFY
