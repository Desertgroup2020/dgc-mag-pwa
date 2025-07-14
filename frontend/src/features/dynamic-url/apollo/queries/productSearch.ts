import {
    ProductAttributeFilterInput,
    ProductAttributeSortInput,
    Products,
  } from "@/generated/types";
  
  import { gql } from "@apollo/client";
  import { PRODUCTS_FRAGMENT_SEARCH } from "../fragments/product";
  
  const PRODUCTS = gql`
    ${PRODUCTS_FRAGMENT_SEARCH}
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
  