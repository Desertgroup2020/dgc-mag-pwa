import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import { Cart } from "@/generated/types";

const GET_CART = gql`
  ${cartFragment}
  query getCart($cart_id: String!) {
    cart(cart_id: $cart_id) {
      ...CartFragment
    }
  }
`;

export type getCartQueryType = {
    Response: {
        cart: Cart
    },
    Variables: {
        cart_id: string
    }
}

export default GET_CART
