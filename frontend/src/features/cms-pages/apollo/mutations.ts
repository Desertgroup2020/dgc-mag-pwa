import { AboutUsOutput } from "@/generated/types";
import { gql } from "@apollo/client";

const MAKE_ENQUIRY_MUTATION = gql`
  mutation makeEnquiry(
    $name: String!
    $email: String!
    $mobile: String!
    $message: String!
  ) {
    createAboutUs(
      name: $name
      email: $email
      mobile: $mobile
      message: $message
    ) {
      message
      success
    }
  }
`;

export type MakeEnquiryType = {
  Response: {
    createAboutUs: AboutUsOutput;
  };
  Variables: {
    name: string;
    email: string;
    mobile: string;
    message: string;
  };
};

export default MAKE_ENQUIRY_MUTATION
