import React, { useCallback, useEffect, useState } from "react";
import { CartItemProps } from "./CartItem";
import useProduct from "@/components/product/useProduct";
import useCartItem from "../hooks/useCartItem";
import { usePrice } from "@/utils";
import useCart from "../hooks/useCart";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import styles from "../styles/cartStyles.module.scss";
// import CircularProgress from "@/components/icons/CircularProgress";
import dynamic from "next/dynamic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useGtm from "@/features/google-tag/hooks/useGtm";

const CircularProgress = dynamic(
  () => import("@/components/icons/CircularProgress")
);

function MiniCartItem({ cartItem }: CartItemProps) {
  const { productImage, title, price } = useProduct({
    product: cartItem.product,
  });
  const { cartItemPrice, cartItemUid, cartItemQuantity, selectedOptions } =
    useCartItem(cartItem);
  const { renderPrice } = usePrice();
  const {
    handleUpdateCartItems,
    updateCartItemsStatus,
    handleRemoveCartItems,
    removeItemFromCartStatus,
  } = useCart();
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
  }, [cart?.id, cartItem, cartItemUid, gtagRemoveFromCartEvent, handleRemoveCartItems]);
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

  return (
    <div className={`mini_cart_item ${styles.mini_cart_item}`}>
      <button
        className="close"
        aria-label="Close"
        disabled={
          updateCartItemsStatus.loading || removeItemFromCartStatus.loading
        }
        onClick={handleRemove}
      >
        {removeItemFromCartStatus.loading ? (
          <CircularProgress />
        ) : (
          <X size={18} />
        )}
      </button>
      <figure>
        <Image
          src={`${productImage?.url}`}
          alt={title || "product image"}
          width={90}
          height={70}
        />
      </figure>
      <div className="details">
        <span className="name">{title}</span>
        <div className="quantity">
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
        </div>
        <div className="price">
          <span>{quantity}</span>
          <X width={15} />
          <span className="value">
            {renderPrice(cartItemPrice || 0)}
          </span>
        </div>
        {selectedOptions?.length ? (
          <Accordion type="single" collapsible className="common_accordian">
            <AccordionItem value="discount" className="acc_item">
              <AccordionTrigger className="heading">
                <span>details</span>
                <ChevronDown stroke="#000" className="icon" />
              </AccordionTrigger>
              <AccordionContent className="acc_content">
                <ul className="details_list">
                  {selectedOptions.map((opt, i) => (
                    <li key={i}>
                      <span className="label">{opt?.option_label}: &nbsp;</span>
                      <span className="value">{opt?.value_label}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : null}
      </div>
    </div>
  );
}

export default MiniCartItem;
