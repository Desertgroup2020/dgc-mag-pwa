"use client";

import React, { useEffect, useRef } from "react";
import CheckoutAddresses from "./CheckoutAddresses";
import dynamic from "next/dynamic";
import { withAuth } from "@/hocs/ProtectedRoutes";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { usePathname, useRouter } from "next/navigation";
import OrderSummery from "../components/OrderSummery";
import ShippingMethods from "./ShippingMethods";
import PaymentMethods from "./PaymentMethods";
import useGtm from "@/features/google-tag/hooks/useGtm";

const AddressContextProvider = dynamic(
  () => import("@/features/checkout/hooks/addressContext"),
  { ssr: false }
);

function CheckoutClient() {
  // hooks
  const exicuteOnce = useRef<boolean>(true);
  const cartLoading = useAppSelector(
    (state) => state.cart.status === "loading" || false
  );
  const customerLoading = useAppSelector(
    (state) => state.auth.status === "loading" || false
  );
  const { gtagCheckoutBeginEvent } = useGtm();
  const token = useAppSelector((state) => state.auth.token);
  const cart = useAppSelector((state) => state.cart.data.cart);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (token) {
      gtagCheckoutBeginEvent();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="login_redirect">
        <p>Please Login for checkout</p>
        <Button
          variant={"action_green"}
          onClick={() => {
            router.push(`${pathname}?signin=dgc-login`);
          }}
          className="btn_action_green_rounded"
        >
          <BtnRightArrow />
          <span>Continue to checkout</span>
        </Button>
      </div>
    );
  }
  if (cartLoading || customerLoading) {
    return <h1>Checkout loading....</h1>;
  }
  // if(!cart || !cart.itemsV2?.items.length){
  //   router.push('/shopping-cart');
  //   return null
  // }
  return (
    <>
      <div className="container">
        <div className="wrapper">
          {cart?.freeshipping_note ? (
            <div className="free_shipping_not">
              <p>{cart.freeshipping_note}</p>
            </div>
          ) : null}
          <div className="divider">
            <div className="col1">
              <AddressContextProvider>
                <CheckoutAddresses />
              </AddressContextProvider>
            </div>
            <div className="col2">
              <ShippingMethods />
              <PaymentMethods />
            </div>
            <div className="col3">
              <OrderSummery />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(CheckoutClient);
