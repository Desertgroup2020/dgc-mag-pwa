import { gql } from "@apollo/client";
import { customerFragment } from "./fragments";
import { Cart, Customer } from "@/generated/types";
import cartFragment from "@/features/cart/apollo/fragments/cartFragment";

export const CUSTOMER_QUERY = gql`
  ${customerFragment}
  query getCustomer {
    customer {
      ...Customer
    }
    customerCart {
      id
    }
  }
`;

export const CHECK_TOKEN_AVAILABILITY = gql`
  query GetCustomer {
    customer {
      token
    }
  }
`;

export const CUSTOMER_CART = gql`
  ${cartFragment}
  query getCustomerCart {
    customerCart {
      ...CartFragment
    }
  }
`;

export type CustomerCartType = {
  Response: {
    customerCart: Cart;
  }
}

export type CustomerQueryType = {
  Response: {
    customer: Customer;
    customerCart: { id: string };
  };
};
