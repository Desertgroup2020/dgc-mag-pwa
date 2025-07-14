import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import { CreateGuestCartOutput } from "@/generated/types";

const CREATE_GUEST_CART = gql`
  ${cartFragment}
  mutation createGuestCart {
    createGuestCart {
      cart {
        ...CartFragment
      }
    }
  }
`;

export type CreateGuestCartType = {
  Response: {
    createGuestCart: CreateGuestCartOutput;
  };
};

export default CREATE_GUEST_CART;
