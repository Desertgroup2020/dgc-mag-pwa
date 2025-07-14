// export const dynamic = "force-dynamic";

import styles from "../../features/checkout/styles/style.module.scss";
import React from "react";
import CheckoutClient from "@/features/checkout/screens/CheckoutClient";
import dynamic from "next/dynamic";
// import CheckoutContextProvider from "@/features/checkout/hooks/checkoutContext";

const CheckoutContextProvider = dynamic(
  () => import("@/features/checkout/hooks/checkoutContext"),
  { ssr: false }
);

function Checkout() {
  return (
    <div className={`checkout ${styles.checkout}`}>
      <div className="banner">
        <div className="container">
          <h1 className="text-h1">CHECKOUT</h1>
        </div>
      </div>
      <CheckoutContextProvider>
        <CheckoutClient />
      </CheckoutContextProvider>
    </div>
  );
}

export default Checkout;
