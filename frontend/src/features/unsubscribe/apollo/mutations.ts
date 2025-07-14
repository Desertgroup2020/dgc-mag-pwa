import { ProductAlertUnsubscribeOutput } from "@/generated/types";
import { gql } from "@apollo/client";

export const UNSUBSCRIBE_PRODUCT = gql`
  mutation productAlertUnsubscribe($productId: Int, $type: String!) {
    productAlertUnsubscribe(productId: $productId, type: $type) {
      id
      message
    }
  }
`;

export type UnsubscribeProductType = {
    Response: {
        productAlertUnsubscribe: ProductAlertUnsubscribeOutput
    },
    Variables: {
        productId?: number,
        type: string
    }
}
