import CircularProgress from "@/components/icons/CircularProgress";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { updateCart } from "@/features/cart/slice/cart";
import {
  AvailableShippingMethod,
  ShippingMethodInput,
} from "@/generated/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePrice } from "@/utils";
import React, { useCallback, useEffect, useMemo } from "react";

type ShippingMethodType = {
  method: AvailableShippingMethod;
  onSelect: (method: ShippingMethodInput) => void;
};
function ShippingMethod({ method, onSelect }: ShippingMethodType) {
  // hooks
  const cart = useAppSelector((state) => state.cart.data.cart);
  const { renderPrice } = usePrice();
  const {
    addShippingMethodOnCart: [
      addShippingMethodOnCart,
      addShippingMethodOnCartStatus,
    ],
  } = useCartMutations();
  const dispatch = useAppDispatch();

  // constnds
  const selectedShippingMethod = useMemo(
    () => cart?.shipping_addresses?.[0]?.selected_shipping_method,
    [cart]
  );

  //   features
  const onShippingMethodSelect = useCallback(
    ({ method }: { method: ShippingMethodInput }) => {
      if (
        cart?.id &&
        method.carrier_code &&
        method.method_code &&
        selectedShippingMethod?.method_code !== method.method_code
      ) {
        addShippingMethodOnCart({
          variables: {
            input: {
              cart_id: cart.id,
              shipping_methods: [
                {
                  carrier_code: method.carrier_code,
                  method_code: method.method_code,
                },
              ],
            },
          },
          onCompleted(data, clientOptions) {
            if (data.setShippingMethodsOnCart.cart) {
              dispatch(updateCart(data.setShippingMethodsOnCart.cart));
              onSelect(method);
            }
          },
        });
      }
    },
    [
      addShippingMethodOnCart,
      cart?.id,
      dispatch,
      selectedShippingMethod,
      method,
    ]
  );

  // effects
  useEffect(() => {
    if (
      selectedShippingMethod?.carrier_code &&
      selectedShippingMethod.method_code
    ) {
      onSelect({
        carrier_code: selectedShippingMethod.carrier_code,
        method_code: selectedShippingMethod.method_code,
      });
    }
  }, [selectedShippingMethod, cart]);

  return (
    <div
      className="method cursor-pointer"
      onClick={() =>
        onShippingMethodSelect({
          method: {
            carrier_code: method?.carrier_code as string,
            method_code: method?.method_code as string,
          } as ShippingMethodInput,
        })
      }
    >
      <button
        className={`selection ${
          method?.method_code === selectedShippingMethod?.method_code
            ? "selected"
            : ""
        }`}
      >
        {addShippingMethodOnCartStatus.loading ? (
          <CircularProgress width={15} />
        ) : null}
      </button>
      <span className="method_name">{method?.carrier_title}&nbsp;</span>
      <span className="method_title">{method?.method_title}&nbsp;</span>
      <div className="method_price">
        <span className="price">{renderPrice(method?.amount.value || 0)}</span>
        <div className="selector"></div>
      </div>
    </div>
  );
}

export default ShippingMethod;
