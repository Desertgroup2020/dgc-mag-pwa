import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import { Cart } from "@/generated/types";

const MERGE_CARTS = gql`
  ${cartFragment}
  mutation mergeCarts($source_cart_id: String!, $destination_cart_id: String) {
    mergeCarts(
      source_cart_id: $source_cart_id
      destination_cart_id: $destination_cart_id
    ) {
      ...CartFragment
    }
  }
`;

export type MergeCartsType = {
    Response: {
        mergeCarts: Cart
    },
    Variables: {
        source_cart_id: string,
        destination_cart_id: string
    }
}

export default MERGE_CARTS
