"use client";

import React, { useCallback, useMemo } from "react";
import style from "./style.module.scss";
import {
  ProductInterface,
  Wishlist,
  WishlistItemInterface,
} from "@/generated/types";
import { usePrice } from "@/utils";
import { Button } from "../ui/button";
import WishlistIcon from "../icons/WishlistIcon";
import Image from "next/image";
import CartIcon from "../icons/CartIcon";
import useProduct from "./useProduct";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { updateCart } from "@/features/cart/slice/cart";
import { useToast } from "../ui/use-toast";
import useCart from "@/features/cart/hooks/useCart";
import useWishlist from "@/features/wishlist/hooks/useWishlist";
import CircularProgress from "../icons/CircularProgress";
import { usePathname, useRouter } from "next/navigation";
import { handleSignInSheet } from "@/redux/window/windowSlice";
import { updateWishlist } from "@/features/wishlist/slice/wishlist";
import { Heart } from "lucide-react";
import ImageSwitcher, { ImageSwitcherType } from "./ImageSwitcher";

interface ProductCardProps {
  product: ProductInterface;
  clasName?: string;
}
function ProductCard({ product, clasName }: ProductCardProps) {
  // hooks
  const wishlist = useAppSelector((state) => state.wishlist.data);
  const { renderPrice } = usePrice();
  const { handleAddToCart, addingToCart } = useCart();
  const {
    addToWishlist,
    addingToWishlist,
    removeFromWishlist,
    removingFromWishlist,
  } = useWishlist();
  const { toast } = useToast();
  const { mpProductLabel, sku, title, isInStock, isConfigurable, productLink } =
    useProduct({
      product: product as ProductInterface,
    });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.data.cart);
  const token = useAppSelector((state) => state.auth.token);

  // constants
  const wishlistItem = useMemo(
    () =>
      wishlist?.items_v2?.items?.find(
        (item, index) => item?.product?.sku === product?.sku
      ),
    [product?.sku, wishlist]
  );
  const isOnWishlist = useMemo(
    () =>
      !!wishlist?.items_v2?.items?.find(
        (item, index) => item?.product?.sku === product?.sku
      ),
    [product?.sku, wishlist]
  );
  const switchingImages = useMemo(() => {
    let mediaGalleryImages = product.media_gallery || [];
    let actualImage = product.image ? [product.image] : [];

    const concatedImages = (
      mediaGalleryImages.length ? mediaGalleryImages : actualImage
    ) as ImageSwitcherType["images"];

    return concatedImages;
  }, [product]);

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
  const onErrorOnAddToWishlist = (error: string) => {
    toast({
      title: "Wishlist",
      variant: "error",
      description: error,
    });
  };
  // console.log("wishlist item", wishlistItem, isOnWishlist);
  // console.log("switchingImages", switchingImages);

  return (
    <div
      className={`hm_product_card ${style.product_card} ${clasName} bg-card flex flex-col justify-between`}
    >
      <div className="action_grup flex flex-col">
        <Button
          className={`icon wishlist ${isOnWishlist ? "active" : ""}`}
          variant={"itself"}
          disabled={removingFromWishlist || addingToWishlist}
          onClick={(e) => {
            e.preventDefault();
            if (!isConfigurable && sku) {
              if (token) {
                if (isOnWishlist) {
                  removeFromWishlist({
                    wishlistItemIds: [wishlistItem?.id as string],
                    onRemove: onCompleteAddToWishlist,
                    onError: onErrorOnAddToWishlist,
                  });
                } else {
                  addToWishlist({
                    wishlistItem: {
                      quantity: 1,
                      sku: sku,
                    },
                    onAdded: onCompleteAddToWishlist,
                    onError: onErrorOnAddToWishlist,
                  });
                }
              } else {
                dispatch(handleSignInSheet(true));
                // router.push(`${pathName}?signin=dgc-login`)
              }
            } else if (isConfigurable) {
              router.push(`/${productLink}`);
            }
          }}
        >
          {removingFromWishlist || addingToWishlist ? (
            <CircularProgress />
          ) : (
            <Heart
              stroke="#448e43"
              fill={`${isOnWishlist ? "#448e43" : "none"}`}
            />
          )}
        </Button>
        {/* <Button className="icon backlog" variant={"itself"}>
          <Backlog />
        </Button> */}
      </div>
      {mpProductLabel?.label_image ? (
        <figure className="product_label">
          <Image
            src={`${mpProductLabel.label_image}`}
            alt="label"
            width={90}
            height={30}
          />
        </figure>
      ) : null}

      <ImageSwitcher images={switchingImages} />

      <div className="content_area flex flex-col items-center">
        <span className="sku text-pcard_num">#{product?.sku}</span>
        <h4 className="text-pcard_title text-muted">{product?.name}</h4>
        <div className="price">
          {!!product?.special_price ? (
            <span className="special text-pcard_old_price line-through">
              {renderPrice(product.special_price)}
            </span>
          ) : null}
          <span className="text-pcard_price text-card-foreground">
            {renderPrice(
              product?.price_range?.minimum_price?.final_price.value as number
            )}
          </span>
        </div>
        <Button
          variant={"action_sqr"}
          className={`btn_action_green_sqr text-pcard_title text-white ${
            isConfigurable || !isInStock ? "its_config" : ""
          }`}
          style={
            !isInStock
              ? {
                  color: "#cc0c39",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }
              : {}
          }
          disabled={addingToCart || !isInStock}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            if (isConfigurable) {
              router.push(`/${productLink}`);
            } else {
              handleAddToCart({
                name: title!,
                cartItems: [
                  {
                    quantity: 1,
                    sku: sku!,
                  },
                ],
              });
            }
          }}
        >
          {isInStock && !isConfigurable ? <CartIcon className="icon" /> : null}
          <span>
            {!isInStock
              ? "OUT OF STOCK"
              : isConfigurable
              ? "Select Options"
              : "Add To Cart"}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
