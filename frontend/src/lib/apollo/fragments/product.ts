import { gql } from "@apollo/client";

export const PRODUCTS_FRAGMENT_PLP = gql`
  fragment ProductItem on ProductInterface {
    __typename
    name
    special_price
    meta_description
    meta_title
    meta_keyword
    url_suffix
    url_key
    canonical_url
    sku
    id
    stock_status
    rating_summary
    review_count
    categories {
      image
      name
    }

    image {
      url
      label
    }
    small_image {
      url
      label
    }
    thumbnail {
      url
    }
    wishlistData {
      wishlistItem
    }
    price_range {
      minimum_price {
        regular_price {
          value
        }
        final_price {
          value
          currency
        }
      }
    }
  }
`;


