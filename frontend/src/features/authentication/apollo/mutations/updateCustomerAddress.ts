import { gql } from "@apollo/client";
import { customerAddressFragment } from "../fragments";
import { CustomerAddress, CustomerAddressInput } from "@/generated/types";

const UPDATE_CUSTOMER_ADDRESS = gql`
  ${customerAddressFragment}
  mutation updateCustomerAddress($id: Int!, $input: CustomerAddressInput) {
    updateCustomerAddress(id: $id, input: $input) {
      ...customerAddressFragment
    }
  }
`;

export type UpdateCustomerAddressType = {
  Response: {
    updateCustomerAddress: CustomerAddress;
  };
  Variables: {
    id: number;
    input: CustomerAddressInput;
  };
};

export default UPDATE_CUSTOMER_ADDRESS;
