"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchWishlist } from "../slice/wishlist";
import makeClient from "@/lib/apollo/apolloProvider";

function WishlistIntialize() {
  const client = makeClient();
  // const wishlist = useAppSelector(selectAuth);
  const wishlist = useAppSelector(
    (state) =>  state.auth.value?.wishlists?.[0]
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (wishlist?.id) {
      dispatch(
        fetchWishlist({
          client,
          wishlistId:  wishlist?.id,
        })
      );
    }
  }, [client, dispatch, wishlist]);  

  return null
}

export default WishlistIntialize;
