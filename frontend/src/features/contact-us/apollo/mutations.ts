import { ContactUsInput, ContactUsOutput } from "@/generated/types";
import { gql } from "@apollo/client";

const CONTACT_US = gql`
  mutation contactUs(
    $firstName: String!
    $lastName: String!
    $email: String!
    $mobile: String!
    $message: String!
  ) {
    createContactUs(
      firstName: $firstName
      lastName: $lastName
      email: $email
      mobile: $mobile
      message: $message
    ) {
      message
      success
    }
  }
`;

export type ContactUsMutationType = {
  Response: {
    createContactUs: ContactUsOutput;
  };
  Variables: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    message: string;
  };
};

export default CONTACT_US;
