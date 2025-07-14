"use client";

import { Cart, CartItemInterface, CustomerOrder, ProductInterface } from "@/generated/types";
import { sendGTMEvent } from "../utils";
import { useAppSelector } from "@/redux/hooks";
import { useCallback } from "react";

function useGtm() {
  const customer = useAppSelector((state) => state.auth.value);
  const cart = useAppSelector((state) => state.cart.data);
  const gtagAddToCartEvent = ({ cart }: { cart: Cart }) => {
    const lastAddedCartItem =
      cart.itemsV2?.items?.[cart.itemsV2?.items.length - 1];
    const lastAddedProduct = lastAddedCartItem?.product;

    const cartItemToEvent = {
      productName: lastAddedProduct?.name || "", // Assuming `name` exists in `item`
      sku: lastAddedProduct?.sku || "",
      price:
        lastAddedProduct?.price_range?.minimum_price?.final_price.value || 0,
      qty: lastAddedCartItem?.quantity || 0, // Assuming `quantity` exists in `item`
    };

    sendGTMEvent("addToCart", {
      currency: "AED",
      items: [cartItemToEvent],
    });
  };

  const gtagRemoveFromCartEvent = ({
    cartItem,
  }: {
    cartItem: CartItemInterface;
  }) => {
    const cartItemProduct = cartItem.product;
    const cartItemToEvent = {
      productName: cartItemProduct?.name || "", // Assuming `name` exists in `item`
      sku: cartItemProduct.sku || "",
      price:
        cartItemProduct?.price_range?.minimum_price?.final_price.value || 0,
      qty: cartItem?.quantity || 0, // Assuming `quantity` exists in `item`
    };

    sendGTMEvent("removeFromCart", {
      currency: "AED",
      items: [cartItemToEvent],
    });
  };

  type OrderItemToEvent = {
    productName: string;
    sku: string;
    price: number;
    qty: number;
  };
  const gtagPurchaseEvent = ({ order }: { order: CustomerOrder }) => {
    const orderItemsToEvent: OrderItemToEvent[] =
      order.items?.reduce((acc, item) => {
        acc.push({
          productName: item?.product?.name || "", // Assuming `name` exists in `item`
          sku: item?.product_sku || "",
          price:
            item?.product?.price_range?.minimum_price?.final_price.value || 0,
          qty: item?.quantity_ordered || 0, // Assuming `quantity` exists in `item`
        });
        return acc;
      }, [] as OrderItemToEvent[]) || [];

    sendGTMEvent("purchase", {
      currency: "AED",
      orderTotal: order.total?.grand_total.value,
      coupons: order.applied_coupons || [],
      transaction_id: order.number,
      items: orderItemsToEvent,
      customerName: `${customer?.firstname} ${customer?.lastname}`,
      customerEmail: customer?.email,
      customerPhone: customer?.mobilenumber,
    });
  };

  const gtagCheckoutBeginEvent = useCallback(() => {
    const orderItemsToEvent: OrderItemToEvent[] =
      cart.cart?.itemsV2?.items?.reduce((acc, item) => {
        acc.push({
          productName: item?.product?.name || "", // Assuming `name` exists in `item`
          sku: item?.product.sku || "",
          price:
            item?.product?.price_range?.minimum_price?.final_price.value || 0,
          qty: item?.quantity || 0, // Assuming `quantity` exists in `item`
        });
        return acc;
      }, [] as OrderItemToEvent[]) || [];

    const checkoutBeginData = {
      currency: "AED",
      orderTotal: cart.cart?.prices?.grand_total?.value,
      coupons: cart.cart?.applied_coupons || [],
      cart_id: cart.cart?.id,
      items: orderItemsToEvent,
      customerName: `${customer?.firstname} ${customer?.lastname}`,
      customerEmail: customer?.email,
      customerPhone: customer?.mobilenumber,
    };

    sendGTMEvent("checkoutBegin", checkoutBeginData);
  }, [cart, customer]);

  const gtagItemViewEvent = ({product}: {product: ProductInterface})=>{
    const productDetailsOnEvent = {
      productName: product.name || "", // Assuming `name` exists in `item`
      sku: product.sku || "",
      price:
        product?.price_range?.minimum_price?.final_price.value || 0,
      qty: 1, // Assuming `quantity` exists in `item`
    }

    sendGTMEvent("viewItem", {
      currency: "AED",
      items: [productDetailsOnEvent],
    });
  }

  return {
    gtagAddToCartEvent,
    gtagRemoveFromCartEvent,
    gtagPurchaseEvent,
    gtagCheckoutBeginEvent,
    gtagItemViewEvent
  };
}

export default useGtm;
