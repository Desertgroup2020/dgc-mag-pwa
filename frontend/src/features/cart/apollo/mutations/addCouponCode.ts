import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import { ApplyCouponToCartInput, ApplyCouponToCartOutput } from "@/generated/types";

const ADD_COUPON_CODE_TO_CART = gql`
  ${cartFragment}
  mutation applyCouponToCart($input: ApplyCouponToCartInput) {
    applyCouponToCart(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
`;

export type AddCouponToCartType = {
    Response: {
        applyCouponToCart: ApplyCouponToCartOutput
    },
    Variables: {
        input: ApplyCouponToCartInput
    }
}

export default ADD_COUPON_CODE_TO_CART
