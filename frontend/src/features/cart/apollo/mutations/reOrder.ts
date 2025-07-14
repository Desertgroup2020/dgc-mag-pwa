import { gql } from "@apollo/client";
import cartFragment from "../fragments/cartFragment";
import { ReorderItemsOutput } from "@/generated/types";

const RE_ORDER = gql`
  ${cartFragment}
  mutation ReOrder($orderNumber: String!) {
    reorderItems(orderNumber: $orderNumber) {
      cart {
        ...CartFragment
        __typename
      }
      userInputErrors {
        code
        message
        __typename
      }
      __typename
    }
  }
`;

export type ReOrderType = {
    Response: {
        reorderItems: ReorderItemsOutput
    },
    Variables: {
        orderNumber: string
    }
}

export default RE_ORDER
