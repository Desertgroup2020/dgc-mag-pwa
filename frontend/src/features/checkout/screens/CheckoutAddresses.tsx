"use client";

import AddressForm, {
  AddressFormValues,
} from "@/components/address/AddressForm";
import useCustomer from "@/features/authentication/hooks/useCustomer";
import React, { useMemo } from "react";
import styles from "../styles/style.module.scss";
import CustomerAddressCard from "@/features/authentication/components/CustomerAddressCartCard";
import { useAddressContext } from "../hooks/addressContext";
import ShippingDetails from "../components/ShippingDetails";
// import BillingDetails from "../components/BillingDetails";
import CircularProgress from "@/components/icons/CircularProgress";
import dynamic from "next/dynamic";

const BillingDetails = dynamic(() => import("../components/BillingDetails"), {
  ssr: false,
  loading: () => <>Loading...</>,
});

function CheckoutAddresses() {
  // hooks
  const {
    sameAsShippingAddress,
    setSameAsShippingAddress,
    isLoadingSameAsShipping,
  } = useAddressContext();
  // states

  // propreties

  return (
    <div className={`checkout_addresses ${styles.checkout_addresses}`}>
      <ShippingDetails />
      <div className={`same_as_checkbox ${styles.same_as_checkbox}`}>
        <input
          type="checkbox"
          name="same_as"
          id="same_as"
          checked={sameAsShippingAddress}
          onChange={() => setSameAsShippingAddress((prev) => !prev)}
        />
        <label htmlFor="same_as">
          {isLoadingSameAsShipping ? (
            <CircularProgress />
          ) : (
            <span className="checker"></span>
          )}

          <span className="label">Billing address is same as shipping</span>
        </label>
      </div>
      {!sameAsShippingAddress && !isLoadingSameAsShipping ? (
        <BillingDetails />
      ) : null}
    </div>
  );
}

export default CheckoutAddresses;
