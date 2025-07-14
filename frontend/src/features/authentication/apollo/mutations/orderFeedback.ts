import {
  CustomerFeedbackInput,
  CustomerFeedbackOutput,
} from "@/generated/types";
import { gql } from "@apollo/client";

const POST_ORDER_FEEDBACK = gql`
  mutation postCustomerFeedback($input: CustomerFeedbackInput!) {
    postCustomerFeedback(input: $input) {
      message
      success
    }
  }
`;

export type PostOrderFeedbackType = {
  Response: {
    postCustomerFeedback: CustomerFeedbackOutput;
  };
  Variables: {
    input: CustomerFeedbackInput;
  };
};

export default POST_ORDER_FEEDBACK;
