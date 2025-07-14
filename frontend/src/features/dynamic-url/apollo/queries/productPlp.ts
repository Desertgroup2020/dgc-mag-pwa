import {
  ProductAttributeFilterInput,
  ProductAttributeSortInput,
  Products,
} from "@/generated/types";

import { gql } from "@apollo/client";
import { PRODUCTS_FRAGMENT_PLP } from "../fragments/product";

const PRODUCTS = gql`
  ${PRODUCTS_FRAGMENT_PLP}
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
      sort_fields {
        default
        options {
          label
          value
        }
      }
      aggregations(filter: { category: { includeDirectChildrenOnly: true } }) {
        attribute_code
        count
        label
        options {
          count
          label
          value
          swatch_data{
            value
          }
        }
      }
      items {
        ...ProductItem
      }
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
      sort_fields {
        default
        options {
          label
          value
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
