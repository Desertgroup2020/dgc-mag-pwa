import { ConfirmAccountOutput } from "@/generated/types";
import { gql } from "@apollo/client";

const ACCOUNT_CONFIRMATION = gql`
  mutation confirmAccount($token: String!, $id: String!) {
    confirmAccount(token: $token, id: $id) {
      customer {
        token
      }
      message
      status
    }
  }
`;

export type ConfirmAccountType = {
  Response: {
    confirmAccount: ConfirmAccountOutput;
  };
  Variables: {
    token: string;
    id: string;
  };
};

export default ACCOUNT_CONFIRMATION;
