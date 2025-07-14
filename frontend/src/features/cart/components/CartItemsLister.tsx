import { CartItemInterface } from "@/generated/types";
import React from "react";
import styles from "../styles/cartStyles.module.scss";
import CartItem from "./CartItem";
import { useAppSelector } from "@/redux/hooks";

type CartItemsListerProps = {
  cartItems: CartItemInterface[];
};
function CartItemsLister({ cartItems }: CartItemsListerProps) {
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  return (
    <div className={`cart_items_lister ${styles.cart_items_lister}`}>
      {winWidth && winWidth > 767 ? (
        <ul className="cart_item_headings">
          <li>
            <h3>PRODUCT</h3>
          </li>
          <li>
            <h3>PRICE</h3>
          </li>
          <li>
            <h3>QUANTITY</h3>
          </li>
          <li>
            <h3>SUBTOTAL</h3>
          </li>
        </ul>
      ) : null}

      <ul className="cart_items">
        {cartItems.map((cartItem, i) => (
          <li key={i}>
            <CartItem key={i} cartItem={cartItem} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartItemsLister;
