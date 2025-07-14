import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import {
  AddBundleProductsToCartInput,
  AddBundleProductsToCartOutput,
} from "@/generated/types";

const ADD_BUNDLE_PRODUCT_TO_CART = gql`
  ${cartFragment}
  mutation addBundleProductsToCart($input: AddBundleProductsToCartInput) {
    addBundleProductsToCart(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
`;

export default ADD_BUNDLE_PRODUCT_TO_CART;

export type AddBundleProductToCartType = {
  Response: {
    addBundleProductsToCart: AddBundleProductsToCartOutput;
  };
  Variables: {
    input: AddBundleProductsToCartInput;
  };
};
