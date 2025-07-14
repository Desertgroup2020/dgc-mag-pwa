import { useAppSelector } from "@/redux/hooks";
import React, { useMemo } from "react";
import MiniCartItem from "./MiniCartItem";
import { CartItemInterface } from "@/generated/types";
import styles from "../styles/cartStyles.module.scss";
import { usePrice } from "@/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function MiniCart({ handleClose }: { handleClose: () => void }) {
  // hooks
  const { renderPrice } = usePrice();

  // states
  const cart = useAppSelector((state) => state.cart.data.cart);

  const grandTotal = useMemo(() => cart?.prices?.grand_total?.value, [cart]);

  return (
    <div className={`mini_cart ${styles.mini_cart}`}>
      <div className="cart_items_wraper">
        <ul className="cart_items">
          {cart?.itemsV2?.items.map((cartItem, i) => (
            <li key={cartItem?.uid}>
              <MiniCartItem cartItem={cartItem as CartItemInterface} />
            </li>
          ))}
        </ul>
      </div>
      <div className="mini_summery">
        <div className="subtotal">
          <span className="label">Subtotal:</span>
          <span className="value">{renderPrice(grandTotal || 0)}</span>
        </div>
        <div className="btn_grup">
          <Link href={"/shopping-cart"} onClick={handleClose}>
            <Button className="normal_btn cart">
              <span>VIEW CART</span>
            </Button>
          </Link>
          <Link href={"/checkout"} onClick={handleClose}>
            <Button className="normal_btn">
              <span>PROCEED TO CHECKOUT</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MiniCart;
