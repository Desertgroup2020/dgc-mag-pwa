import { gql } from "@apollo/client";
import { WISHLIST_FRAGMENT } from "./fragments";
import { Customer } from "@/generated/types";

export const GET_WISHLIST = gql`
  ${WISHLIST_FRAGMENT}
  query Wishlists($id: ID!, $page: Int, $size: Int) {
    customer {
      wishlist_v2(id: $id) {
        ...WishlistFragment
      }
    }
  }
`;

export interface WishlistQueryType {
  Response: {
    customer: Customer;
  };
  Variables: {
    page?: number;
    size?: number;
    id: string | number;
  };
}
