import {
  ProductAttributeFilterInput,
  ProductAttributeSortInput,
  Products,
} from "@/generated/types";

import { gql } from "@apollo/client";
import { PRODUCTS_FRAGMENT_PDP } from "../fragments/product";

const PRODUCTS = gql`
  ${PRODUCTS_FRAGMENT_PDP}
  query Products(
    $search: String
    $filter: ProductAttributeFilterInput
    $pageSize: Int
    $currentPage: Int
    $sort: ProductAttributeSortInput
  ) {
    products(
      search: $search
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
    ) {
      items {
        ...ProductItem
        ... on SimpleProduct {
          only_x_left_in_stock
        }
        upsell_products {
          ...ProductItem
        }
        related_products {
          ...ProductItem
        }
        ... on BundleProduct {
          dynamic_sku
          dynamic_price
          dynamic_weight
          price_view
          ship_bundle_items

          items {
            uid
            title
            required
            type
            position
            sku
            option_id
            options {
              uid
              id
              quantity
              position
              is_default
              price
              price_type
              can_change_quantity
              label
              product {
                uid
                name
                sku
                stock_status
                __typename
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
            }
          }
        }
        ... on ConfigurableProduct {
          only_x_left_in_stock

          variants {
            attributes {
              uid
              code
            }
            product {
              stock_status
              media_gallery {
                disabled
                position
                url
                position
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
          }
          configurable_options {
            label
            attribute_code
            uid
            values {
              label
              uid
              swatch_data {
                __typename
                value
              }
            }
          }
        }
      }
    }
  }
`;

export type ProductsQuery = {
  Variables: {
    search?: string;
    filter?: ProductAttributeFilterInput;
    pageSize?: number;
    currentPage?: number;
    sort?: ProductAttributeSortInput;
  };
  Response: {
    products: Products;
  };
};

export default PRODUCTS;
