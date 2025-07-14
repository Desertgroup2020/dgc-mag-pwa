"use client";

import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useCart from "../hooks/useCart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CartItemsLister from "../components/CartItemsLister";
import { CartItemInterface, ProductInterface } from "@/generated/types";
import CartSummery from "../components/CartSummery";
import { Button } from "@/components/ui/button";
import ApplyCoupon from "../components/ApplyCoupon";
import { throttle } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import UpsellProducts from "@/features/product-details/components/UpsellProducts";

function CartClient() {
  // hooks
  const router = useRouter();
  const cart = useAppSelector((state) => state.cart.data.cart);
  const isCartUpdating = useAppSelector(
    (state) => state.cart.updatingCart || state.cart.status === "loading"
  );
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const { cartItemsAllCrosssellProducts } = useCart();

  // refs
  const cartSummeryPointerRef = useRef<HTMLButtonElement | null>(null);
  const cartSummeryRef = useRef<HTMLDivElement | null>(null);
  let lastScrollY = window.scrollY;

  // states
  const [initialLoading, setInitialLoading] = useState(true);
  const isFirstLoad = useRef(true); // useRef to track the first load

  // features
  const handleScroll = (event: Event) => {
    if (cartSummeryPointerRef.current && cartSummeryRef.current) {
      const currentScrollY = window.scrollY;
      const elemtop = cartSummeryRef.current.offsetTop - 112;

      // Check if the scroll direction is down (i.e., current scroll position is greater than the last scroll position)
      if (
        currentScrollY > lastScrollY &&
        currentScrollY <= elemtop - window.innerHeight &&
        currentScrollY > 115
      ) {
        cartSummeryPointerRef.current.classList.add("visible");
      } else if (
        currentScrollY < lastScrollY ||
        currentScrollY >= elemtop - window.innerHeight ||
        currentScrollY < 115
      ) {
        cartSummeryPointerRef.current.classList.remove("visible");
      }

      // Update the last scroll position
      lastScrollY = currentScrollY;
    }
  };

  // effects
  useEffect(() => {
    if (isFirstLoad.current) {
      if (!isCartUpdating) {
        setInitialLoading(false);
        isFirstLoad.current = false; // Mark that first load is complete
      }
    }
  }, [isCartUpdating]);

  useLayoutEffect(() => {
    window.addEventListener("scroll", throttle(handleScroll, 200));

    return () =>
      window.removeEventListener("scroll", throttle(handleScroll, 200));
  }, []);

  // console.log("crossell", cartItemsAllCrosssellProducts);

  if (initialLoading) return <span>Loading...</span>;

  return (
    <div className="cart_client">
      {winWidth && winWidth < 1024 ? (
        <button
          className="summery_pointer fixed"
          ref={cartSummeryPointerRef}
          onClick={() => {
            if (cartSummeryRef.current) {
              const elemtop = cartSummeryRef.current.offsetTop - 112;

              window.scrollTo({ top: elemtop, behavior: "smooth" });
            }
          }}
        >
          <span>Cart Totals</span>
          <span className="icon">
            <ChevronDown stroke="#fff" />
          </span>
        </button>
      ) : null}
      <div className="head">
        <div className="container">
          <h1 className="text-h1">SHOPPING CART</h1>
        </div>
      </div>
      {!cart?.itemsV2?.total_count ? (
        <div className="container  py-8 flex flex-col items-center">
          <h2 className="text-h2 mb-4">Your Cart is empty</h2>
          <Button className="normal_btn">
            <Link href={"/"}>shop now</Link>
          </Button>
        </div>
      ) : (
        <div className="cart_contents">
          <div className="container">
            <div className="divider">
              <div className="left">
                {cart.itemsV2?.items.length ? (
                  <CartItemsLister
                    cartItems={cart.itemsV2?.items as CartItemInterface[]}
                  />
                ) : null}
                <div className="coupon" ref={cartSummeryRef}>
                  <ApplyCoupon />
                </div>
              </div>
              <div className="right">
                <CartSummery />
              </div>
            </div>
            {cartItemsAllCrosssellProducts.length ? (
              <div className="crossell_products">
                <UpsellProducts
                  products={cartItemsAllCrosssellProducts as ProductInterface[]}
                  title={`More Choices`}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default CartClient;
