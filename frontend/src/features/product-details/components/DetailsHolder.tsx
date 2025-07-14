import Backlog from "@/components/icons/Backlog";
// import CircularProgress from "@/components/icons/CircularProgress";
import FacebookIcon from "@/components/icons/FacebookIcon";
import WhatsappIcon from "@/components/icons/WhatsappIcon";
import BulkOrderRequestSkeleton from "@/components/loader/productdisplay/BulkOrderRequestSkeleton";
import useProduct from "@/components/product/useProduct";
import Modal from "@/components/reusable-uis/Modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { BundleProduct, ProductInterface, Wishlist } from "@/generated/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePrice } from "@/utils";
import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { useConfigurableContext } from "./configurable/configurableContext";
import useCart from "@/features/cart/hooks/useCart";
import { usePdpContext } from "../hooks/pdpContext";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import CartIcon from "@/components/icons/CartIcon";
import useWishlist from "@/features/wishlist/hooks/useWishlist";
import { updateWishlist } from "@/features/wishlist/slice/wishlist";
import { handleSignInSheet } from "@/redux/window/windowSlice";
// import BundleScreen from "./bundle/BundleScreen";
// import NotifyOutofStock from "./NotifyOutofStock";
// import ConfigurableScreen from "./configurable/ConfigurableScreen";
// import BulkOrderRequestForm from "./BulkOrderRequestForm";

const BulkOrderRequestForm = dynamic(() => import("./BulkOrderRequestForm"), {
  loading: () => <BulkOrderRequestSkeleton />,
});
const ConfigurableScreen = dynamic(
  () => import("./configurable/ConfigurableScreen"),
  {
    loading: () => <span>Loading configurable...</span>,
  }
);
const NotifyOutofStock = dynamic(() => import("./NotifyOutofStock"), {
  loading: () => <span>Loading...</span>,
});
const CircularProgress = dynamic(
  () => import("@/components/icons/CircularProgress")
);
const BundleScreen = dynamic(() => import("./bundle/BundleScreen"));

interface DetailsHolderProps {
  product: ProductInterface;
}
function DetailsHolder({ product }: DetailsHolderProps) {
  // hooks
  const router = useRouter();
  const { toast } = useToast();
  const { renderPrice } = usePrice();
  const {
    addToWishlist,
    addingToWishlist,
    removeFromWishlist,
    removingFromWishlist,
  } = useWishlist();
  const {
    title,
    price,
    // stockStatus,
    shortDescription,
    qtyRemains,
    productLink,
    isInStock,
    sku,
  } = useProduct({
    product,
  });
  const {
    notifyProduct: [notifyProduct, notifyProductStatus],
  } = useCartMutations();
  const { handleAddToCart, addingToCart } = useCart();
  const { configState, updateBuyCount } = useConfigurableContext();
  const { actualPrice, stockStatusLabel } = usePdpContext();
  const dispatch = useAppDispatch();

  // constands
  const basePath = process.env.NEXT_PUBLIC_PRODUCTION_URL;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${title}%20${basePath}/${productLink}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${basePath}/${productLink}&quote=${encodeURIComponent(
    title || ""
  )}`;

  // states
  const wishlist = useAppSelector((state) => state.wishlist.data);
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const token = useAppSelector((state) => state.auth.token);
  const pathname = usePathname();
  const [productCount, setProductCount] = useState(1);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);

  // computed
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

  // propreties
  const handleIncreament = () => updateBuyCount(configState.buyCount + 1);
  const handleDecrement = () =>
    updateBuyCount(configState.buyCount !== 1 ? configState.buyCount - 1 : 1);
  const handleBulkModalOPen = () => setBulkModalOpen((prev) => !prev);
  const handleNotify = () => {
    setNotifying(true);
    if (!token) {
      router.push(`${pathname}?signin=dgc-login`);
      setNotifying(false);
    } else {
      notifyProduct({
        variables: {
          sku: product.sku as string,
          type: "PRODUCT_ALERT_PRICE_DROP",
        },
        onCompleted(data, clientOptions) {
          if (data.productAlertSubscribe) {
            toast({
              variant: "success",
              title: "Notify product",
              description: "You saved the alert subscription.",
            });
          }
        },
      }).finally(() => setNotifying(false));
    }
  };
  const onAddtoCart = () => {
    const buyCount = configState.buyCount;
    const configOptionUidArray = Object.values(configState.configurableOptions);

    if (buyCount && sku && title) {
      handleAddToCart({
        name: title,
        cartItems: [
          {
            quantity: buyCount,
            sku: sku,
            selected_options: (configOptionUidArray as string[]) || null,
          },
        ],
      });
    }
  };
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

  return (
    <>
      {/* <h1 className="text-h1">{title}</h1> */}
      {(winWidth && winWidth) > 991 ? (
        <div className="headings">
          <h1 className="text-h1">{title}</h1>
          <div className="sku">
            <span className="label">Item Code:&nbsp;</span>
            <span className="value">{sku}</span>
          </div>
        </div>
      ) : null}
      <div className="price_holder">
        <span className="price text-h2">{renderPrice(actualPrice || 0)}</span>
      </div>
      {shortDescription ? (
        <div
          className="short_desc"
          dangerouslySetInnerHTML={{ __html: shortDescription.html }}
        ></div>
      ) : null}
      <div className="cart_sec">
        {isInStock ? (
          <div className="notify_price_change">
            <button onClick={handleNotify} disabled={notifying}>
              Notify me when the price drops
            </button>
            {notifying ? <CircularProgress stroke="#000" /> : null}
          </div>
        ) : null}

        {isInStock ? (
          <div className="stock_status">
            <span
              className={`status ${
                stockStatusLabel === "Out of stock" ? "out_stock" : ""
              }`}
            >
              {stockStatusLabel}
            </span>
            {qtyRemains ? (
              <span className="addon">{`Only ${qtyRemains} left `}</span>
            ) : null}
          </div>
        ) : (
          <NotifyOutofStock sku={sku || ""} stockStatus={stockStatusLabel} />
        )}

        {(product as ProductInterface & { __typename: string }).__typename ===
        "ConfigurableProduct" ? (
          <ConfigurableScreen />
        ) : null}

        {isInStock &&
        (product as ProductInterface & { __typename: string }).__typename !==
          "BundleProduct" ? (
          <div className="btn_grup">
            <div className="cntrls cart_addition_btn">
              <button className="dec cart_btn" onClick={handleDecrement}>
                -
              </button>
              <span>{configState.buyCount}</span>
              <button className="inc cart_btn" onClick={handleIncreament}>
                +
              </button>
            </div>
            {/* <Button
              variant={"action_green"}
              onClick={onAddtoCart}
              className="btn_action_green_rounded"
              disabled={addingToCart}
            >
              <span>Add to cart</span>
              {addingToCart ? <span><CircularProgress /></span> : <BtnRightArrow />}              
            </Button> */}
            <Button
              variant={"action_green"}
              className={`btn_action_green_sqr text-pcard_title text-white`}
              style={
                !isInStock
                  ? {
                      color: "#cc0c39",
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    }
                  : {}
              }
              disabled={addingToCart || stockStatusLabel === "Out of stock"}
              onClick={onAddtoCart}
            >
              {addingToCart ? (
                <span>
                  <CircularProgress />
                </span>
              ) : (
                <CartIcon className="icon" />
              )}
              <span>{!isInStock ? "OUT OF STOCK" : "Add To Cart"}</span>
            </Button>
          </div>
        ) : null}
        {(product as ProductInterface & { __typename: string }).__typename ===
        "BundleProduct" ? (
          <BundleScreen product={product as BundleProduct} />
        ) : null}
      </div>
      <button className="bulk_enquiry" onClick={handleBulkModalOPen}>
        <span>Make Enquiry Corporate & Bulk orders</span>
      </button>
      <ul className="wish_compare">
        <li>
          <button
            disabled={addingToWishlist || removingFromWishlist}
            onClick={(e) => {
              e.preventDefault();
              const configOptionUidArray = Object.values(
                configState.configurableOptions
              );
              if (sku) {
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
                        selected_options: configOptionUidArray as string[],
                      },
                      onAdded: onCompleteAddToWishlist,
                      onError: onErrorOnAddToWishlist,
                    });
                  }
                } else {
                  dispatch(handleSignInSheet(true));
                  // router.push(`${pathName}?signin=dgc-login`)
                }
              }
            }}
          >
            {removingFromWishlist || addingToWishlist ? (
              <CircularProgress />
            ) : (
              <Heart
                width={19}
                stroke="#448e43"
                fill={`${isOnWishlist ? "#448e43" : "none"}`}
              />
            )}
            <span>
              {isOnWishlist ? "Remove from wishlist" : "Add to wishlist"}{" "}
            </span>
          </button>
        </li>
        {/* <li>
          <button>
            <Backlog className="icon" width={24} fill="#5E5E5E" />
            <span>Compare</span>
          </button>
        </li> */}
      </ul>
      <div className="share">
        <span className="title">Share</span>
        <ul className="medias">
          <li>
            <Link href={whatsappUrl} target="_blank">
              <WhatsappIcon />
            </Link>
          </li>
          <li>
            <Link href={facebookUrl} target="_blank">
              <FacebookIcon />
            </Link>
          </li>
        </ul>
      </div>

      {/* site modal may be change later */}
      <Modal
        className="bulk_order_modal"
        isOpen={bulkModalOpen}
        setIsOpen={handleBulkModalOPen}
      >
        <BulkOrderRequestForm
          productId={product.id as number}
          close={handleBulkModalOPen}
        />
      </Modal>
    </>
  );
}

export default DetailsHolder;
