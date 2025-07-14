import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import { SetPaymentMethodOnCartInput, SetPaymentMethodOnCartOutput } from "@/generated/types";

const SET_PAYMENT_METHOD = gql`
  ${cartFragment}
  mutation setPaymentMethodOnCart($input: SetPaymentMethodOnCartInput) {
    setPaymentMethodOnCart(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
`;

export type SetPaymentMethodToCartType = {
    Response:{
        setPaymentMethodOnCart: SetPaymentMethodOnCartOutput
    },
    Variables: {
        input: SetPaymentMethodOnCartInput
    }
}

export default SET_PAYMENT_METHOD
