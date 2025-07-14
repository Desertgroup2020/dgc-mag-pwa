import {
  SetShippingAddressesOnCartInput,
  SetShippingAddressesOnCartOutput,
} from "@/generated/types";
import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";

const ADD_SHIPPING_ADDRESS = gql`
  ${cartFragment}
  mutation setShippingAddressesOnCart($input: SetShippingAddressesOnCartInput) {
    setShippingAddressesOnCart(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
`;

export type AddShippingAddressType = {
  Response: {
    setShippingAddressesOnCart: SetShippingAddressesOnCartOutput;
  };
  Variables: {
    input: SetShippingAddressesOnCartInput;
  };
};

export default ADD_SHIPPING_ADDRESS;
