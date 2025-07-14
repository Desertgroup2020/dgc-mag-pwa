import { ProductInterface, Wishlist, WishlistItemInput, WishlistItemInterface } from "@/generated/types";
import { useAppSelector } from "@/redux/hooks";
import { Maybe } from "graphql/jsutils/Maybe";
import useMutations from "./useMutations";
import { useMemo } from "react";

function useWishlist() {
  // states
  const wishListId = useAppSelector((state) => state.wishlist.data?.id);

  const {
    addProductToWishlist: [addProductToWishlist, addProductToWishlistStatus],
    removeProductToWishlist: [
      removeProductToWishlist,
      removeProductToWishlistStatus,
    ],
    addWishListItemsOnCart: [addWishListItemsOnCart, addWishListItemsOnCartStatus]
  } = useMutations();

  // features
  type AddToWishlistProps = {
    wishlistItem: WishlistItemInput;
    onAdded: (wishlist: Wishlist) => void;
    onError: (error: string) => void;
  };
  const addToWishlist = async ({
    wishlistItem,
    onError,
    onAdded,
  }: AddToWishlistProps) => {
    try {
      if (wishListId && wishlistItem) {
        const wishlistResponse = await addProductToWishlist({
          variables: {
            wishlistId: wishListId,
            wishlistItems: [wishlistItem],
          },
        });

        if (wishlistResponse.data?.addProductsToWishlist.user_errors.length) {
          onError(
            wishlistResponse.data?.addProductsToWishlist.user_errors?.[0]
              ?.message || "Ooops!"
          );
        } else {
          const wishlist =
            wishlistResponse.data?.addProductsToWishlist.wishlist;
          if (wishlist) {
            onAdded(wishlist);
          }
        }
      }
    } catch (err) {
      throw err;
    }
  };

  type RemoveFromWishlistType = {
    wishlistItemIds: (string | number)[];
    onRemove: (wishlist: Wishlist) => void;
    onError: (error: string) => void;
  };
  const removeFromWishlist = async ({
    onError,
    onRemove,
    wishlistItemIds,
  }: RemoveFromWishlistType) => {
    try {
      if (wishlistItemIds.length && wishListId) {
        const response = await removeProductToWishlist({
          variables: {
            wishlistId: wishListId,
            wishlistItemIds,
          },
        });

        if (response.data?.removeProductsFromWishlist.user_errors.length) {
          const error =
            response.data?.removeProductsFromWishlist.user_errors?.[0];
          onError(error?.message || "Ooops!");
        } else {
          const wishlist = response.data?.removeProductsFromWishlist.wishlist;
          if (wishlist) {
            onRemove(
              response.data?.removeProductsFromWishlist.wishlist as Wishlist
            );
          }
        }
      }
    } catch (err) {
      onError(err as string);
    }
  };

  type AddWishlistItemOnCart = {
    wishlistItemId: string;
    onError: (error: string) => void;
    onSuccess: (wishlist: Wishlist) => void;
  }
  const addWishlistItemOnCart = async({wishlistItemId, onError, onSuccess}:AddWishlistItemOnCart)=>{
    try{
      if(wishListId && wishlistItemId){
        addWishListItemsOnCart({
          variables:{
            wishlistId: wishListId,
            wishlistItemIds: [wishlistItemId] 
          },
          onCompleted(data, clientOptions) {
            if(!data.addWishlistItemsToCart.add_wishlist_items_to_cart_user_errors.length){
              if(data.addWishlistItemsToCart.status && data.addWishlistItemsToCart.wishlist){
                onSuccess(data.addWishlistItemsToCart.wishlist);
              }else{
                onError("Something went wrong!")
              }
            }else{
              const errMsg = data.addWishlistItemsToCart.add_wishlist_items_to_cart_user_errors?.[0]?.message;
              onError(errMsg || "Something went wrong!")
            }
            
          },
        })
      }
    }catch(err){
      onError(err as string);
    }
  }

  
  

  return {
    wishListId,
    addToWishlist,
    addingToWishlist: addProductToWishlistStatus.loading,
    removeFromWishlist,
    removingFromWishlist: removeProductToWishlistStatus.loading,
    addWishlistItemOnCart,
    addingWishlistItemOnCart: addWishListItemsOnCartStatus.loading
  };
}

export default useWishlist;
