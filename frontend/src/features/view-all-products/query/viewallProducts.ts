import {
  Id,
  ProductAttributeSortInput,
  ViewAllProducts,
} from "@/generated/types";
import { PRODUCTS_FRAGMENT_PLP } from "@/lib/apollo/fragments/product";
import { gql } from "@apollo/client";

const VIEW_ALL_PRODUCTS = gql`
  ${PRODUCTS_FRAGMENT_PLP}
  query viewallProducts(
    $pageSize: Int
    $currentPage: Int
    $sort: ProductAttributeSortInput
    $input: Id!
  ) {
    viewallProducts(
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
      input: $input
    ) {
      page_info {
        current_page
        page_size
        total_pages
      }
      products {
        ...ProductItem
      }
      total_count
    }
  }
`;

export type ViewAllProductsType = {
  Response: {
    viewallProducts: ViewAllProducts;
  };
  Variables: {
    pageSize: number;
    currentPage: number;
    sort: ProductAttributeSortInput;
    input: Id;
  };
};
export default VIEW_ALL_PRODUCTS;
