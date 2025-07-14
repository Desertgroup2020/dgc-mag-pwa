import {
  AddAdvProductReviewInput,
  AddAdvProductReviewOutput,
} from "@/generated/types";
import { gql } from "@apollo/client";

const ADD_PRODUCT_REVIEW = gql`
  mutation addProductReview($input: AddAdvProductReviewInput) {
    addAdvProductReview(input: $input) {
      success
    }
  }
`;

export type AddProductReviewType = {
  Response: {
    addAdvProductReview: AddAdvProductReviewOutput;
  };
  Variables: {
    input: AddAdvProductReviewInput;
  };
};

export default ADD_PRODUCT_REVIEW
