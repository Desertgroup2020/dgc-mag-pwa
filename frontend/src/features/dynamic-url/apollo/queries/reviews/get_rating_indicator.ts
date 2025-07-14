import { AmReviewSetting } from "@/generated/types";
import { gql } from "@apollo/client";

const RATING_INDICATOR = gql`
  query getRatingIndicators {
    amReviewSetting {
      ratings {
        rating_id
        rating_code
        rating_options {
          option_id
          value
        }
      }
    }
  }
`;

export type GetRatingIndicatorsType = {
    Response:{
        amReviewSetting: AmReviewSetting
    }
}

export default RATING_INDICATOR
