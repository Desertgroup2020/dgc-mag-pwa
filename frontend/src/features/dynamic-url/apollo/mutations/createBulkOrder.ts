import { BulkOrderOutput } from "@/generated/types";
import { gql } from "@apollo/client";

const REQUEST_BULK_ORDER = gql`
  mutation requestBulkOrder(
    $product_id: Int!
    $customer_name: String!
    $email: String!
    $mobile: String!
    $quantity: Int!
    $message: String!
  ) {
    createBulkOrder(
      product_id: $product_id
      customer_name: $customer_name
      email: $email
      quantity: $quantity
      message: $message
      mobile: $mobile
    ) {
      message
      success
    }
  }
`;

export type RequestBulkOrderType = {
  Response: {
    createBulkOrder: BulkOrderOutput;
  };
  Variables: {
    product_id: number;
    customer_name: string;
    email: string;
    quantity: number;
    message: string;
    mobile: string
  };
};

export default REQUEST_BULK_ORDER
