import { PRODUCTS_FRAGMENT_PLP } from "@/features/dynamic-url/apollo/fragments/product";
import { gql } from "@apollo/client";

export const WISHLIST_FRAGMENT = gql`
  ${PRODUCTS_FRAGMENT_PLP}
  fragment WishlistFragment on Wishlist {
    id
    items_count
    sharing_code
    updated_at
    items_v2(currentPage: $page, pageSize: $size) {
      items {
        id
        added_at
        description
        quantity
        product {
          ...ProductItem
        }
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;
