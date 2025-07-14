import { customerFragment, customerFragmentWithoutReward } from "@/features/authentication/apollo/fragments";
import {
  CustomerInput,
  ProofData,
  WholeSalerCustomerAccountOutput,
} from "@/generated/types";
import { gql } from "@apollo/client";

export const CREATE_WHOLESALER_ACCOUNT = gql`
  mutation createWholesalerAccount(
    $input: CustomerInput!
    $mobileNumber: String!
    $websiteId: Int
    $companyName: String!
    $licenceNumber: String!
    $customerProof: ProofData!
  ) {
    createWholesalerAccount(
      input: $input
      mobileNumber: $mobileNumber
      websiteId: $websiteId
      companyName: $companyName
      licenceNumber: $licenceNumber
      customerProof: $customerProof
    ) {     
      message
      status
    }
  }
`;

export type CreateWholesalerAccountType = {
  Response: {
    createWholesalerAccount: WholeSalerCustomerAccountOutput;
  };
  Variables: {
    input: CustomerInput;
    mobileNumber: string;
    websiteId: number;
    companyName: string;
    licenceNumber: string;
    customerProof: ProofData;
  };
};
