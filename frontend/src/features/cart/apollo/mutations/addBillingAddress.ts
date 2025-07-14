import {
  SetBillingAddressOnCartInput,
  SetBillingAddressOnCartOutput,
} from "@/generated/types";
import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";

const ADD_BILLING_ADDRESS = gql`
  ${cartFragment}
  mutation setBillingAddressOnCart($input: SetBillingAddressOnCartInput) {
    setBillingAddressOnCart(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
`;

export type AddBillingAddressType = {
  Response: {
    setBillingAddressOnCart: SetBillingAddressOnCartOutput;
  };
  Variables: {
    input: SetBillingAddressOnCartInput;
  };
};

export default ADD_BILLING_ADDRESS;
