import ProductCard from "@/components/product/ProductCard";
import { ProductInterface } from "@/generated/types";
import { useAppSelector } from "@/redux/hooks";
import styles from "../styles/account.module.scss";
import React from "react";
import WishlistItemProductCard from "@/features/wishlist/components/WishlistItemProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function WishListScreen() {
  const wishlistItems = useAppSelector(
    (state) => state.wishlist.data?.items_v2?.items
  );

  return (
    <div className={`wish_list_acc_area ${styles.wish_list_acc_area}`}>
      <h2 className="text-h2 mb-2">My Wishlist</h2>

      {wishlistItems?.length ? (
        <ul className="items">
          {wishlistItems?.map((wishlistItem) => (
            <li key={wishlistItem?.id}>
              <WishlistItemProductCard
                product={wishlistItem?.product as ProductInterface}
                wishlistItemId={wishlistItem?.id as string}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="container  py-8 flex flex-col items-center">
          <h2 className="text-h2 mb-4">Your Wishlist is empty</h2>
          <Button className="normal_btn">
            <Link href={"/"}>Add products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default WishListScreen;
