import { useErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import React from "react";
import { ADD_PRODUCT_TO_WISHLIST, ADD_WISHLIST_ITEMS_TO_CART, AddProductToWishlistType, AddWishlistItemsToCartType, REMOVE_FROM_WISHLIST, RemoveProductsFromWishlistMutation } from "../apollo/mutations";

function useMutations() {
  // hooks
  const errorHandler = useErrorHandler();

  // features
  const addProductToWishlist = useMutation<
    AddProductToWishlistType["Response"],
    AddProductToWishlistType["Variables"]
  >(ADD_PRODUCT_TO_WISHLIST, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const removeProductToWishlist = useMutation<
    RemoveProductsFromWishlistMutation["Response"],
    RemoveProductsFromWishlistMutation["Variables"]
  >(REMOVE_FROM_WISHLIST, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const addWishListItemsOnCart = useMutation<
  AddWishlistItemsToCartType["Response"],
  AddWishlistItemsToCartType["Variables"]
  >(ADD_WISHLIST_ITEMS_TO_CART, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });


  return {
    addProductToWishlist,
    removeProductToWishlist,
    addWishListItemsOnCart
  };
}

export default useMutations;
