import { gql } from "@apollo/client";

export const PRODUCTS_FRAGMENT_PLP = gql`
  fragment ProductItem on ProductInterface {
    __typename
    name
    special_price
    url_suffix
    url_key
    sku
    id
    stock_status
    url_rewrites {
      url
    }
    mp_label_data {
      label_template
      label_image
      label
    }
    image {
      url
      label
    }
    media_gallery {
      url
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
export const PRODUCTS_FRAGMENT_SEARCH = gql`
  fragment ProductItem on ProductInterface {
    __typename
    name
    url_suffix
    url_key
    url_rewrites {
      url
    }
    image {
      url
      label
    }
    categories {
      name
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
export const PRODUCTS_FRAGMENT_ORDER = gql`
  fragment ProductItem on ProductInterface {
    __typename
    name
    sku
    url_suffix
    url_key
    short_description {
      html
    }

    url_rewrites {
      url
    }
    image {
      url
      label
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
export const PRODUCTS_FRAGMENT_PDP = gql`
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
    mp_label_data {
      label_template
      label_image
      label
    }
    description {
      html
    }
    url_rewrites {
      url
    }
    categories {
      image
      name
      url_path
      breadcrumbs {
        category_name
        category_uid
        category_url_path
      }
    }
    stock_status
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
    media_gallery {
      disabled
      position
      url
      position
    }
    product_videos {
      thumbnail
      video_id
      title
      content
      video_type
      video_url
      video_file
    }
    short_description {
      html
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
