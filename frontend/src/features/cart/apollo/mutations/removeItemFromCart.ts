import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import { RemoveItemFromCartInput, RemoveItemFromCartOutput } from "@/generated/types";

const REMOVE_ITEM_FROM_CART = gql`
  ${cartFragment}
  mutation removeItemFromCart($input: RemoveItemFromCartInput) {
    removeItemFromCart(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
`;

export type RemoveItemFromCartType = {
    Response: {
        removeItemFromCart: RemoveItemFromCartOutput  
    },
    Variables: {
        input: RemoveItemFromCartInput
    },    
}

export default REMOVE_ITEM_FROM_CART