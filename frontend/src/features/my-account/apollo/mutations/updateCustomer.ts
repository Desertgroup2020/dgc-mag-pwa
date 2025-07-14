import { customerFragment } from "@/features/authentication/apollo/fragments";
import { CustomerOutput, CustomerUpdateInput } from "@/generated/types";
import { gql } from "@apollo/client";

const UPDATE_CUSTOMER = gql`
  ${customerFragment}
  mutation updateCustomer($input: CustomerUpdateInput!) {
    updateCustomerV2(input: $input) {
      customer {
        ...Customer
      }
    }
  }
`;

export type UpdateCustomerType = {
    Response: {
        updateCustomerV2: CustomerOutput
    },
    Variables: {
        input: CustomerUpdateInput
    }
}

export default UPDATE_CUSTOMER;