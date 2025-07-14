import { useAppSelector } from "@/redux/hooks";
import React, { useMemo } from "react";
import PaymentMethod from "../components/PaymentMethod";
import { AvailablePaymentMethod } from "@/generated/types";
import { useCheckoutContext } from "../hooks/checkoutContext";
import styles from '../styles/style.module.scss';

function PaymentMethods() {
  // contexts
  const { formik, openPurchaseInputAccValue, setOpenPurchaseInputAccValue } =
    useCheckoutContext();
  // hooks
  const cart = useAppSelector((state) => state.cart.data.cart);
  // computed
  const availablePaymentMethods = useMemo(
    () => cart?.available_payment_methods,
    [cart]
  );

  return (
    <div className={`payment_method_screen ${styles.payment_method_screen}`}>
      <h2 className=" text-h2">Payment Method</h2>
      <div className="payment_methods">
        {availablePaymentMethods?.map((method, i) => (
          <PaymentMethod
            method={method as AvailablePaymentMethod}
            key={i}
            onSelect={(code) => {
              if (code) {
                formik.setFieldValue("paymentMethod", code);
              }
            }}
            openPurchaseInputAccValue={openPurchaseInputAccValue}
            setOpenPurchaseInputAccValue={setOpenPurchaseInputAccValue}
          />
        ))}

        {formik.errors?.["paymentMethod"] ? (
          <div className="error text-left text-red-500 py-1">
            <p>{formik.errors["paymentMethod"]}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PaymentMethods;
