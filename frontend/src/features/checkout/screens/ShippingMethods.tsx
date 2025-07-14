import { useAppSelector } from "@/redux/hooks";
import React, { useMemo } from "react";
import ShippingMethod from "../components/ShippingMethod";
import { AvailableShippingMethod } from "@/generated/types";
import { useCheckoutContext } from "../hooks/checkoutContext";
import styles from '../styles/style.module.scss';

function ShippingMethods() {
  // contexts
  const { formik } = useCheckoutContext();
  // hooks
  const cart = useAppSelector((state) => state.cart.data.cart);
  // computed
  const shippingMethods = useMemo(
    () => cart?.shipping_addresses?.[0]?.available_shipping_methods,
    [cart]
  );

  return (
    <div className={`shipping_methods_screen ${styles.shipping_methods_screen}`}>
      {shippingMethods?.length ? (
        <div className="shipping">
          <h2 className=" text-h2">Shipping Method</h2>
          <div className="shipping_wrap">
            <div className="shipping_methods">
              {shippingMethods?.map((method, i) => (
                <ShippingMethod
                  method={method as AvailableShippingMethod}
                  onSelect={(method) => {
                    if (method.method_code) {
                      formik.setFieldValue(
                        "shippingMethod",
                        method.method_code
                      );
                    }
                  }}
                  key={i}
                />
              ))}
            </div>
            {formik.errors?.["shippingMethod"] ? (
              <div className="error text-right text-red-500 py-1">
                <p>{formik.errors["shippingMethod"]}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="error text-left text-red-500 py-1 font-700">
          <span className="label">Please provide a shipping address</span>
        </div>
      )}
    </div>
  );
}

export default ShippingMethods;
