import { ProductInterface, Wishlist } from "@/generated/types";
import { useRouter } from "next/navigation";
import styles from "../styles/style.module.scss";
import React, { useCallback } from "react";
import useProduct from "@/components/product/useProduct";
import Image from "next/image";
import { usePrice } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useWishlist from "../hooks/useWishlist";
import { useToast } from "@/components/ui/use-toast";
import { updateWishlist } from "../slice/wishlist";
import Link from "next/link";
import { fetchCart } from "@/features/cart/slice/cart";
import makeClient from "@/lib/apollo/apolloProvider";

type WishlistItemProductCardProps = {
  product: ProductInterface;
  wishlistItemId: string;
};
function WishlistItemProductCard({
  product,
  wishlistItemId,
}: WishlistItemProductCardProps) {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.data);
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const router = useRouter();
  const { renderPrice } = usePrice();
  const { productLink, productImage, title, price } = useProduct({ product });
  const {
    removeFromWishlist,
    removingFromWishlist,
    addWishlistItemOnCart,
    addingWishlistItemOnCart,
  } = useWishlist();
  const cart = useAppSelector(state=> state.cart.data.cart);
  const client = makeClient();
  const { toast } = useToast();

  // features
  const onCompleteAddToWishlist = useCallback(
    (wishlist: Wishlist) => {
      if (wishlist) {
        // console.log("wish list from update", wishlist);

        dispatch(updateWishlist(wishlist));
      }
    },
    [dispatch]
  );
  const onCompleteAddWishlistItemToCart = useCallback(
    (wishlist: Wishlist) => {
      if (wishlist && cart?.id) {
        dispatch(updateWishlist(wishlist));
        dispatch(fetchCart({
          client,
          cartId: cart.id
        }))
      }
    },
    [dispatch]
  );
  const onErrorOnAddToWishlist = (error: string) => {
    toast({
      title: "Wishlist",
      variant: "error",
      description: error,
    });
  };
  const handleRemoveWishlist = () => {
    if (wishlist?.id) {
      removeFromWishlist({
        wishlistItemIds: [wishlistItemId as string],
        onRemove: onCompleteAddToWishlist,
        onError: onErrorOnAddToWishlist,
      });
    }
  };

  return (
    <div className="wishlist_card">
      
      <div className={`cart_item ${styles.wishlist_item}`}>
        <div className="lister">
          <div
            className="product_cart_image"
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push(`/${productLink}`);
            }}
          >
            <figure>
              <Image
                src={productImage?.url || ""}
                alt={title || "product image"}
                width={174}
                height={218}
                className="wihlist_img"
              />
            </figure>
          </div>
          <div className="product_cart_details">
            <div className="txt_cnt">
              <h4 onClick={() => {
              router.push(`/${productLink}`);
            }} className=" cursor-pointer">
                {title && title.length > 30
                  ? title.slice(0, 40) + "..."
                  : title}
              </h4>
            </div>

            <div className="price">
              <span className="final_price">{renderPrice(price || 0)}</span>
            </div>
            <div className="product_cart_label_1">
              <p>Inclusive of all taxes</p>
            </div>
            {/* <div>
              {selectedOptions?.length ? (
                <ul className="details_list">
                  {selectedOptions.map((opt, i) => (
                    <li key={i}>
                      <span className="label">{opt?.option_label} &nbsp;</span>
                      <span className="value">{opt?.value_label}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div> */}
            {/* <div className="quantity">
              <div className="cntrls cart_addition_btn">
                <button
                  className="dec cart_btn"
                  disabled={
                    updateCartItemsStatus.loading ||
                    removeItemFromCartStatus.loading
                  }
                  onClick={handleDecQty}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  className="inc cart_btn"
                  disabled={
                    updateCartItemsStatus.loading ||
                    removeItemFromCartStatus.loading
                  }
                  onClick={handleIncQty}
                >
                  +
                </button>
              </div>
            </div> */}
          </div>

          {/* <div className="sub_total">
              <span>
                {updateCartItemsStatus.loading
                  ? "loading..."
                  : renderPrice(cartItemTotalPrice || 0)}
              </span>
            </div> */}
        </div>
        <div className="cart_cruds">
          <button
            disabled={removingFromWishlist}
            // onClick={handleRemove}
            onClick={handleRemoveWishlist}
          >
            {removingFromWishlist ? (
              // <CircularProgress />
              <p>Removing</p>
            ) : (
              " Remove"
            )}
          </button>
          <button
            disabled={addingWishlistItemOnCart}
            onClick={(e) => {
              e.preventDefault();
              addWishlistItemOnCart({
                onError: onErrorOnAddToWishlist,
                onSuccess: onCompleteAddWishlistItemToCart,
                wishlistItemId: wishlistItemId,
              });
            }}
          >
            {addingWishlistItemOnCart ? "MOVING TO CART..." : "MOVE TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistItemProductCard;
