import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import {
  SetShippingMethodsOnCartInput,
  SetShippingMethodsOnCartOutput,
} from "@/generated/types";

const ADD_SHIPPING_METHOD = gql`
  ${cartFragment}
  mutation addShippingMethodOnCart($input: SetShippingMethodsOnCartInput) {
    setShippingMethodsOnCart(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
`;

export type AddShippingMethodType = {
  Response: {
    setShippingMethodsOnCart: SetShippingMethodsOnCartOutput;
  };
  Variables: {
    input: SetShippingMethodsOnCartInput;
  };
};

export default ADD_SHIPPING_METHOD;