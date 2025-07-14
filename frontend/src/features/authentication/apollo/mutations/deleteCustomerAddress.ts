import { gql } from "@apollo/client";

const DELETE_CUSTOMER_ADDRESS = gql`
  mutation deleteCustomerAddress($id: Int!) {
    deleteCustomerAddress(id: $id)
  }
`;


export type DeleteCustomerAddressType = {
    Response: {
        deleteCustomerAddress: boolean
    },
    Variables: {
        id: number
    }
}

export default DELETE_CUSTOMER_ADDRESS