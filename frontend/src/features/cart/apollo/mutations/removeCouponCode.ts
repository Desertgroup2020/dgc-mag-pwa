import { gql } from "@apollo/client";
import CART_FRAGMENT from "../fragments/cartFragment";
import { RemoveCouponFromCartInput, RemoveCouponFromCartOutput } from "@/generated/types";

const REMOVE_COUPON_FROM_CART = gql`
    ${CART_FRAGMENT}
    mutation removeCouponFromCart($input: RemoveCouponFromCartInput){
        removeCouponFromCart(input: $input){
            cart{
                ...CartFragment
            }
        }
    }
`

export type RemoveCouponFromCartType = {
    Response: {
        removeCouponFromCart: RemoveCouponFromCartOutput
    },
    Variables: {
        input: RemoveCouponFromCartInput
    }
}

export default REMOVE_COUPON_FROM_CART