import { gql } from "@apollo/client";
import { customerAddressFragment } from "../fragments";
import { CustomerAddress, CustomerAddressInput } from "@/generated/types";

const ADD_CUSTOMER_ADDRESS = gql`
  ${customerAddressFragment}
  mutation addCustomerAddress($input: CustomerAddressInput!) {
    createCustomerAddress(input: $input) {
      ...customerAddressFragment
    }
  }
`;

export type AddCustomerAddressType = {
  Response: {
    createCustomerAddress: CustomerAddress;
  };
  Variables: {
    input: CustomerAddressInput;
  };
};

export default ADD_CUSTOMER_ADDRESS;
