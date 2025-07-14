import { UpdateCartItemsInput, UpdateCartItemsOutput } from "@/generated/types";
import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";

const UPDATE_CART_ITEMS = gql`
  ${cartFragment}
  mutation updateCartItems($input: UpdateCartItemsInput) {
    updateCartItems(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
`;

export type UpdateCartItemsType = {
  Response: {
    updateCartItems: UpdateCartItemsOutput;
  };
  Variables: {
    input: UpdateCartItemsInput;
  };
};

export default UPDATE_CART_ITEMS;
