import {
  AddProductsToWishlistOutput,
  AddWishlistItemsToCartOutput,
  RemoveProductsFromWishlistOutput,
  WishlistItemInput,
} from "@/generated/types";
import { PRODUCTS_FRAGMENT_PLP } from "@/lib/apollo/fragments/product";
import { gql } from "@apollo/client";
import { Maybe } from "graphql/jsutils/Maybe";

export const ADD_PRODUCT_TO_WISHLIST = gql`
  ${PRODUCTS_FRAGMENT_PLP}
  mutation addProductsToWishlist(
    $wishlistId: ID!
    $wishlistItems: [WishlistItemInput!]!
  ) {
    addProductsToWishlist(
      wishlistId: $wishlistId
      wishlistItems: $wishlistItems
    ) {
      user_errors {
        code
        message
      }
      wishlist {
        id
        items_count
        items_v2 {
          items {
            id
            added_at
            description
            quantity
            product {
              ...ProductItem
            }
          }
        }
        sharing_code
        updated_at
      }
    }
  }
`;
export type AddProductToWishlistType = {
  Response: {
    addProductsToWishlist: AddProductsToWishlistOutput;
  };
  Variables: {
    wishlistId: Maybe<string>;
    wishlistItems: WishlistItemInput[];
  };
};

export const REMOVE_FROM_WISHLIST = gql`
  ${PRODUCTS_FRAGMENT_PLP}
  mutation removeFromWishlist($wishlistId: ID!, $wishlistItemIds: [ID!]!) {
    removeProductsFromWishlist(
      wishlistId: $wishlistId
      wishlistItemsIds: $wishlistItemIds
    ) {
      user_errors {
        code
        message
      }
      wishlist {
        id
        items_count
        items_v2 {
          items {
            id
            added_at
            description
            quantity
            product {
              ...ProductItem
            }
          }
        }
        sharing_code
        updated_at
      }
    }
  }
`;

export interface RemoveProductsFromWishlistMutation {
  Response: { removeProductsFromWishlist: RemoveProductsFromWishlistOutput };
  Variables: {
    wishlistId: string | number;
    wishlistItemIds: (string | number)[];
  };
}

export const ADD_WISHLIST_ITEMS_TO_CART = gql`
  ${PRODUCTS_FRAGMENT_PLP}
  mutation addWishlistItemsToCart($wishlistId: ID!, $wishlistItemIds: [ID!]) {
    addWishlistItemsToCart(
      wishlistId: $wishlistId
      wishlistItemIds: $wishlistItemIds
    ) {
      add_wishlist_items_to_cart_user_errors {
        code
        message
        wishlistId
        wishlistItemId
      }
      status
      wishlist {
        id
        items_count
        items_v2 {
          items {
            id
            added_at
            description
            quantity
            product {
              ...ProductItem
            }
          }
        }
      }
    }
  }
`;

export type AddWishlistItemsToCartType = {
  Response: {
    addWishlistItemsToCart: AddWishlistItemsToCartOutput;
  };
  Variables: {
    wishlistId: string;
    wishlistItemIds: string[];
  };
};
