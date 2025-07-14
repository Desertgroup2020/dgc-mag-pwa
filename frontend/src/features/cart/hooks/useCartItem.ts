import { CartItemInterface, ConfigurableCartItem } from "@/generated/types";
import React, { useMemo } from "react";

function useCartItem(cartItem: CartItemInterface) {
  const cartItemPrice = useMemo(() => cartItem.prices?.price.value, [cartItem]);
  const cartItemTotalPrice = useMemo(
    () => cartItem.prices?.row_total.value,
    [cartItem]
  );
  const cartItemUid = useMemo(() => cartItem.uid, [cartItem]);
  const cartItemQuantity = useMemo(() => cartItem.quantity, [cartItem]);
  
  const selectedOptions = useMemo(
    () => (cartItem as ConfigurableCartItem).configurable_options,
    [cartItem]
  );

  return {
    cartItemPrice,
    cartItemTotalPrice,
    cartItemUid,
    cartItemQuantity,
    selectedOptions
  };
}

export default useCartItem;
