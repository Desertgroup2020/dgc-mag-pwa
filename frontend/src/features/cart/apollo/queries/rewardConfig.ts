import { RewardConfig } from "@/generated/types";
import { gql } from "@apollo/client";

const GET_REWARD_CONFIG = gql`
  query getRewardConfig {
    MpRewardConfig {
      display {
        mini_cart
        top_page
      }
      earning {
        earn_from_tax
        earn_shipping
        point_refund
        round_method
      }
      general {
        account_navigation_label
        display_point_label
        enabled
        icon
        maximum_point
        plural_point_label
        point_label
        show_point_icon
        zero_amount
      }
      spending {
        discount_label
        maximum_point_per_order
        minimum_balance
        restore_point_after_refund
        spend_on_ship
        spend_on_tax
        use_max_point
      }
    }
  }
`;

export type GetRewardConfigType = {
    Response: {
        MpRewardConfig: RewardConfig
    }    
}

export default GET_REWARD_CONFIG;
