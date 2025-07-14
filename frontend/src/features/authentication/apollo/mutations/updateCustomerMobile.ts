import { Response } from "@/generated/types";
import { gql } from "@apollo/client";

const UPDATE_CUSTOMER_MOBILE_OTP_REQUEST = gql`
  mutation updateCustomerOtpRequest(
    $newmobileNumber: String
    $customerId: String
    $oldmobileNumber: String
    $websiteId: Int
    $isresend: Boolean
  ) {
    updateMobilenumber(
      newmobileNumber: $newmobileNumber
      customerId: $customerId
      oldmobileNumber: $oldmobileNumber
      websiteId: $websiteId
      isresend: $isresend
    ) {
      data
      response
      status
    }
  }
`;

export type UpdateCustomerMobileOtpRequestType = {
    Response: {
        updateMobilenumber: Response
    },
    Variables: {
        newmobileNumber: string,
        customerId: string,
        oldmobileNumber: string,
        websiteId: number,
        isresend: boolean
    }
}

export default UPDATE_CUSTOMER_MOBILE_OTP_REQUEST
