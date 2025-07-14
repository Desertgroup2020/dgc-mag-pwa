import {
  CategoryFilterInput,
  CategoryResult,
  CategoryTree,
  Maybe,
} from "@/generated/types";
import { gql } from "@apollo/client";

// export const CATEGORY = `
//     query getCategories(
//     $filter: CategoryFilterInput
//     $pagesize: Int
//     $page: Int
//   ){
//     categories(filters: $filter, pageSize: $pagesize, currentPage: $page) {
//       items {
//         name
//         image
//         url_path
//         url_suffix
//         children {
//           name
//           include_in_menu
//           url_key
//           url_path
//           url_suffix
//           uid
//           children {
//             name
//             include_in_menu
//             url_key
//             url_path
//             url_suffix
//           }
//         }
//       }
//     }
//     }
// `;

export const CATEGORY = gql`
  query getCategories(
    $filter: CategoryFilterInput
    $pageSize: Int
    $currentPage: Int
  ) {
    categories(
      filters: $filter
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      megamenuImage
      megamenuImageInfo {
        image
        url
      }
      items {
        name
        uid
        id
        url_key
        url_path
        url_suffix
        include_in_menu
        children {
          name
          include_in_menu
          url_key
          url_path
          url_suffix
          uid
          id
          image
          children {
            name
            include_in_menu
            url_key
            url_path
            url_suffix
            uid
            id
            image
            children {
              name
              include_in_menu
              url_key
              url_path
              url_suffix
              uid
              id
              image
            }
          }
        }
      }
    }
  }
`;

export type CategoryQuery = {
  Response: {
    categories: CategoryResult;
  };
  Variables: {
    filter?: CategoryFilterInput;
    // pageSize?: number;
    // currentPage?: number;
  };
};
