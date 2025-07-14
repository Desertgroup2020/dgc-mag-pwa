import { AddressInformationInput, TotalSegmentsOutput } from "@/generated/types";
import { gql } from "@apollo/client";

const MP_REWARD_SPEND_POINT = gql`
  mutation MpRewardSpendPoint(
    $cartId: String!
    $points: Int!
    $rule_id: String!
    $address_information: AddressInformationInput!
  ) {
    MpRewardSpendingPoint(
      cart_id: $cartId
      points: $points
      rule_id: $rule_id
      address_information: $address_information
    ) {
      code
      title
      value
    }
  }
`;
// mutation MpRewardSpendingPoint( $cartId: String!, $points: Int!, $rule_id: String!, $address_information: {AddressInformationInput!} ) {
//   MpRewardSpendingPoint( cart_id: $cartId,points: $points,rule_id: $rule_id ,address_information: $address_information) {
//     code
//     title
//     value
//   }
// }
export default MP_REWARD_SPEND_POINT;

export type MpRewardSpendingPointMutation = {
  Response: {
    MpRewardSpendingPoint: TotalSegmentsOutput;
  };
  Variables: {
    cartId: string;
    points: number;
    rule_id: string;
    address_information: AddressInformationInput;
  };
};
