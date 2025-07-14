import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import { AddProductsToCartOutput, CartItemInput } from "@/generated/types";

const ADD_PRODUCTS_TO_CART = gql`
  ${cartFragment}
  mutation addProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
      cart {
        ...CartFragment
      }
      user_errors {
        code
        message
      }
    }
  }
`;

export type AddProductsToCartType = {
    Response: {
        addProductsToCart: AddProductsToCartOutput
    },
    Variables: {
        cartId: string,
        cartItems: CartItemInput[]
    }
}
export default ADD_PRODUCTS_TO_CART;
