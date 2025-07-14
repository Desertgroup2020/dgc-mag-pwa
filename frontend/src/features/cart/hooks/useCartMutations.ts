import { useErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import React from "react";
import CREATE_GUEST_CART, {
  CreateGuestCartType,
} from "../apollo/mutations/createGuestCart";
import MERGE_CARTS, { MergeCartsType } from "../apollo/mutations/mergeCarts";
import ADD_PRODUCTS_TO_CART, {
  AddProductsToCartType,
} from "../apollo/mutations/addProductsToCart";
import UPDATE_CART_ITEMS, {
  UpdateCartItemsType,
} from "../apollo/mutations/updateCartItems";
import REMOVE_ITEM_FROM_CART, {
  RemoveItemFromCartType,
} from "../apollo/mutations/removeItemFromCart";
import ADD_COUPON_CODE_TO_CART, {
  AddCouponToCartType,
} from "../apollo/mutations/addCouponCode";
import REMOVE_COUPON_FROM_CART, {
  RemoveCouponFromCartType,
} from "../apollo/mutations/removeCouponCode";
import MP_REWARD_SPEND_POINT, {
  MpRewardSpendingPointMutation,
} from "../apollo/mutations/mpRewardPoints";
import NOTIFY_PRODUCT, {
  NotifyProductType,
} from "../apollo/mutations/notifyProduct";
import ADD_SHIPPING_ADDRESS, {
  AddShippingAddressType,
} from "../apollo/mutations/addShippingAddress";
import ADD_BILLING_ADDRESS, {
  AddBillingAddressType,
} from "../apollo/mutations/addBillingAddress";
import ADD_SHIPPING_METHOD, {
  AddShippingMethodType,
} from "../apollo/mutations/addShippingMethod";
import SET_PAYMENT_METHOD, {
  SetPaymentMethodToCartType,
} from "../apollo/mutations/addPaymentMethod";
import PLACE_ORDER, { PlaceOrderType } from "../apollo/mutations/placeOrder";
import RE_ORDER, { ReOrderType } from "../apollo/mutations/reOrder";
import SYNC_PAYFORT_MAJENTO, { SyncPayfortMajento } from "../apollo/mutations/syncPayfortMajento";
import ADD_BUNDLE_PRODUCT_TO_CART, { AddBundleProductToCartType } from "../apollo/mutations/addBundleProductToCart";

function useCartMutations() {
  const errorHandler = useErrorHandler();

  const createGuestCart = useMutation<CreateGuestCartType["Response"]>(
    CREATE_GUEST_CART,
    {
      onCompleted(data, clientOptions) {},
      onError: errorHandler,
    }
  );

  const mergeCarts = useMutation<
    MergeCartsType["Response"],
    MergeCartsType["Variables"]
  >(MERGE_CARTS, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const addProductsToCart = useMutation<
    AddProductsToCartType["Response"],
    AddProductsToCartType["Variables"]
  >(ADD_PRODUCTS_TO_CART, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const addBundleProductsToCart = useMutation<
    AddBundleProductToCartType["Response"],
    AddBundleProductToCartType["Variables"]
  >(ADD_BUNDLE_PRODUCT_TO_CART, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const updateCartItems = useMutation<
    UpdateCartItemsType["Response"],
    UpdateCartItemsType["Variables"]
  >(UPDATE_CART_ITEMS, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const removeItemFromCart = useMutation<
    RemoveItemFromCartType["Response"],
    RemoveItemFromCartType["Variables"]
  >(REMOVE_ITEM_FROM_CART, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const applyCouponToCart = useMutation<
    AddCouponToCartType["Response"],
    AddCouponToCartType["Variables"]
  >(ADD_COUPON_CODE_TO_CART, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const removeCouponFromCart = useMutation<
    RemoveCouponFromCartType["Response"],
    RemoveCouponFromCartType["Variables"]
  >(REMOVE_COUPON_FROM_CART, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const mpRewardPoints = useMutation<
    MpRewardSpendingPointMutation["Response"],
    MpRewardSpendingPointMutation["Variables"]
  >(MP_REWARD_SPEND_POINT, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const notifyProduct = useMutation<
    NotifyProductType["Response"],
    NotifyProductType["Variables"]
  >(NOTIFY_PRODUCT, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const addShippingAddressOnCart = useMutation<
    AddShippingAddressType["Response"],
    AddShippingAddressType["Variables"]
  >(ADD_SHIPPING_ADDRESS, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const addBillingAddressOnCart = useMutation<
    AddBillingAddressType["Response"],
    AddBillingAddressType["Variables"]
  >(ADD_BILLING_ADDRESS, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const addShippingMethodOnCart = useMutation<
    AddShippingMethodType["Response"],
    AddShippingMethodType["Variables"]
  >(ADD_SHIPPING_METHOD, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const addPaymentMethodOnCart = useMutation<
    SetPaymentMethodToCartType["Response"],
    SetPaymentMethodToCartType["Variables"]
  >(SET_PAYMENT_METHOD, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const placeOrder = useMutation<
    PlaceOrderType["Response"],
    PlaceOrderType["Variables"]
  >(PLACE_ORDER, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const reOrder = useMutation<
    ReOrderType["Response"],
    ReOrderType["Variables"]
  >(RE_ORDER, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const syncPayfortMajento = useMutation<
    SyncPayfortMajento["Response"],
    SyncPayfortMajento["Variables"]
  >(SYNC_PAYFORT_MAJENTO, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  return {
    createGuestCart,
    mergeCarts,
    addProductsToCart,
    addBundleProductsToCart,
    updateCartItems,
    removeItemFromCart,
    applyCouponToCart,
    removeCouponFromCart,
    mpRewardPoints,
    notifyProduct,
    addShippingAddressOnCart,
    addBillingAddressOnCart,
    addShippingMethodOnCart,
    addPaymentMethodOnCart,
    placeOrder,
    reOrder,
    syncPayfortMajento
  };
}

export default useCartMutations;
