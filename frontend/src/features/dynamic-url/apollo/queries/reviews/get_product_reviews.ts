import { ReviewsData } from "@/generated/types";
import { gql } from "@apollo/client";

const GET_PRODUCT_REVIEWS = gql`
  query getProductReviews($productId: Int!, $page: Int!) {
    advreview(productId: $productId, page: $page) {
      detailedSummary {
        five
        four
        one
        three
        two
      }
      items {
        answer
        comments {
          content
        }
        created_at
        customer_id
        detail
        detail_id
        entity_code
        entity_id
        entity_pk_value
        guest_email
        images {
          full_path
        }
        is_recommended
        like_about
        minus_review
        nickname
        not_like_about
        plus_review
        rating_votes {
          option_id
        }
        review_id
        status_id
        title
        verified_buyer
      }
      ratingSummary
      ratingSummaryValue
      recomendedPercent
      totalRecords
      totalRecordsFiltered
    }
  }
`;

export type GetProductReviewType = {
  Response: {
    advreview: ReviewsData;
  };
  Variables: {
    productId: number;
    page: number;
  };
};

export default GET_PRODUCT_REVIEWS;
