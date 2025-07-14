import { CartItemInterface } from "@/generated/types";
import { usePrice } from "@/utils";
import Image from "next/image";
import React from "react";

type OrderedCartItemProps = {
    cartItem: CartItemInterface
}
function OrderedCartItem({cartItem}: OrderedCartItemProps) {
    // hooks
    const {renderPrice} = usePrice();

  return (
    <div className="cart_item">
      <figure>
        <Image
          src={`${cartItem?.product.image?.url || "/"}`}
          alt={`${cartItem?.product.name}`}
          width={80}
          height={80}
        />
      </figure>
      <div className="cnt">
        <h3>{cartItem?.product.name}</h3>
        <span className="qty">Qty: {cartItem?.quantity}</span>
        <span className="price">
          {renderPrice(cartItem?.prices?.price.value || 0)}
        </span>
      </div>
    </div>
  );
}

export default OrderedCartItem;
