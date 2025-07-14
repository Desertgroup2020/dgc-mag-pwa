import useProduct from "@/components/product/useProduct";
import { BundleCartItem, CartItemInterface } from "@/generated/types";
import { usePrice } from "@/utils";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import useCartItem from "../hooks/useCartItem";
import styles from "../styles/cartStyles.module.scss";
import { ChevronDown, X } from "lucide-react";
import useCart from "../hooks/useCart";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useGtm from "@/features/google-tag/hooks/useGtm";
import BundleProductLister from "./BundleProductLister";

const CircularProgress = dynamic(
  () => import("@/components/icons/CircularProgress")
);

export type CartItemProps = {
  cartItem: CartItemInterface;
};
function CartItem({ cartItem }: CartItemProps) {
  const router = useRouter();
  const { productImage, title, productLink, isInStock } = useProduct({
    product: cartItem.product,
  });
  const {
    cartItemPrice,
    cartItemTotalPrice,
    cartItemUid,
    cartItemQuantity,
    selectedOptions,
  } = useCartItem(cartItem);
  const { renderPrice } = usePrice();
  const {
    handleUpdateCartItems,
    updateCartItemsStatus,
    handleRemoveCartItems,
    removeItemFromCartStatus,
  } = useCart();
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const { gtagRemoveFromCartEvent } = useGtm();

  // states
  const [quantity, setQuantity] = useState(cartItemQuantity || 1);
  const cart = useAppSelector((state) => state.cart.data.cart);

  // console.log("updated cart from cart item", cart);

  // features
  const handleUpdateQty = useCallback(
    (qty: number) => {
      if (quantity >= 1 && cart?.id) {
        handleUpdateCartItems({
          cartId: cart.id,
          cart_items: [
            {
              cart_item_uid: cartItemUid,
              quantity: qty,
            },
          ],
          completed(cart) {
            // setQuantity();
          },
          error() {
            setQuantity(qty - 1);
          },
        });
      }
    },
    [quantity, cart?.id, handleUpdateCartItems, cartItemUid]
  );
  const handleRemove = useCallback(() => {
    if (cart?.id && cartItemUid)
      handleRemoveCartItems({
        input: {
          cart_id: cart.id,
          cart_item_uid: cartItemUid,
        },
        onRemove() {
          gtagRemoveFromCartEvent({ cartItem });
        },
      });
  }, [
    cart?.id,
    cartItemUid,
    handleRemoveCartItems,
    gtagRemoveFromCartEvent,
    cartItem,
  ]);
  const handleIncQty = () => {
    setQuantity((prev) => {
      handleUpdateQty(prev + 1);
      return prev + 1;
    });
  };
  const handleDecQty = () => {
    setQuantity((prev) => {
      // prev <= 1 ? 1 : prev - 1
      if (prev <= 1) {
        return 1;
      } else {
        handleUpdateQty(prev - 1);
        return prev - 1;
      }
    });
  };

  // effects
  useEffect(() => {
    if (cartItem.quantity) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  // console.log("cart item product is in stock", isInStock);

  return (
    <>
      {winWidth && winWidth < 767 ? (
        <>
          <div className={`mobile_cart_item ${styles.mobile_cart_item}`}>
            <button
              className="remove"
              disabled={
                updateCartItemsStatus.loading ||
                removeItemFromCartStatus.loading
              }
              onClick={handleRemove}
            >
              {removeItemFromCartStatus.loading ? (
                <CircularProgress />
              ) : (
                <X size={18} />
              )}
            </button>
            <figure
              className={`prod_image ${
                selectedOptions?.length ? "items-start" : "items-center"
              }`}
            >
              <Image
                src={productImage?.url || ""}
                alt={title || "product image"}
                width={160}
                height={90}
                onClick={() => {
                  router.push(`${productLink}`);
                }}
              />
              <div className="cnt">
                {!isInStock ? (
                  <span className=" text-red-600 font-600 block mb-2">
                    OUT OF STOCK
                  </span>
                ) : null}
                <h4
                  onClick={() => {
                    router.push(`${productLink}`);
                  }}
                >
                  {title}
                </h4>
                <div className="price">
                  <span className="label">Price: &nbsp;</span>
                  <div className="value">
                    <span>{renderPrice(cartItemPrice || 0)}</span>
                  </div>
                </div>
                {(cartItem as BundleCartItem).bundle_options?.length ? (
                  <BundleProductLister cartItem={cartItem as BundleCartItem} />
                ) : null}
                {selectedOptions?.length ? (
                  <Accordion
                    type="single"
                    collapsible
                    className="common_accordian"
                  >
                    <AccordionItem value="discount" className="acc_item">
                      <AccordionTrigger className="heading">
                        <span>details</span>
                        <ChevronDown stroke="#000" className="icon" />
                      </AccordionTrigger>
                      <AccordionContent className="acc_content">
                        <ul className="details_list">
                          {selectedOptions.map((opt, i) => (
                            <li key={i}>
                              <span className="label">
                                {opt?.option_label}: &nbsp;
                              </span>
                              <span className="value">{opt?.value_label}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : null}
              </div>
            </figure>
            <div className="details">
              <div className="quantity">
                <span className="label">Quantity</span>
                <div className="cntrls cart_addition_btn value">
                  <button
                    className="dec cart_btn"
                    disabled={
                      updateCartItemsStatus.loading ||
                      removeItemFromCartStatus.loading ||
                      !isInStock
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
                      removeItemFromCartStatus.loading ||
                      !isInStock
                    }
                    onClick={handleIncQty}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="sub_total">
                <span className="label">Sub Total</span>
                <div className="value">
                  <span>
                    {updateCartItemsStatus.loading
                      ? "loading..."
                      : renderPrice(cartItemTotalPrice || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={`cart_item ${styles.cart_item}`}>
          <button
            className="remove"
            disabled={
              updateCartItemsStatus.loading || removeItemFromCartStatus.loading
            }
            onClick={handleRemove}
          >
            <X />
          </button>
          <div className="lister">
            <div className="product_wrap">
              <div
                className="product"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push(`${productLink}`);
                }}
              >
                <figure>
                  <Image
                    src={productImage?.url || ""}
                    alt={title || "product image"}
                    width={90}
                    height={90}
                  />
                </figure>
                <div className="txt_cnt">
                  <div className="title_bar">
                    {!isInStock ? (
                      <span className="font-600 text-red-600 block mb-2">
                        OUT OF STOCK
                      </span>
                    ) : null}
                    <h4>{title}</h4>
                  </div>
                  {selectedOptions?.length ? (
                    <ul className="details_list">
                      {selectedOptions.map((opt, i) => (
                        <li key={i}>
                          <span className="label">
                            {opt?.option_label}: &nbsp;
                          </span>
                          <span className="value">{opt?.value_label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
              {(cartItem as BundleCartItem)?.bundle_options?.length ? (
                <BundleProductLister cartItem={cartItem as BundleCartItem} />
              ) : null}
            </div>
            <div className="price">
              <span>{renderPrice(cartItemPrice || 0)}</span>
            </div>
            <div className="quantity">
              <div className="cntrls cart_addition_btn">
                <button
                  className="dec cart_btn"
                  disabled={
                    updateCartItemsStatus.loading ||
                    removeItemFromCartStatus.loading ||
                    !isInStock
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
                    removeItemFromCartStatus.loading ||
                    !isInStock
                  }
                  onClick={handleIncQty}
                >
                  +
                </button>
              </div>
            </div>
            <div className="sub_total">
              <span>
                {updateCartItemsStatus.loading
                  ? "loading..."
                  : renderPrice(cartItemTotalPrice || 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartItem;
