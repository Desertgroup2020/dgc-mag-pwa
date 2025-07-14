import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import useCartMutations from "../hooks/useCartMutations";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/use-toast";
import { updateCart } from "../slice/cart";
import styles from "../styles/cartStyles.module.scss";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CircularProgress = dynamic(
  () => import("@/components/icons/CircularProgress")
);

function ApplyCoupon() {
  // hooks
  const {
    applyCouponToCart: [addCouponCodeToCart, addCouponCodeToCartStatus],
    removeCouponFromCart: [removeCouponFromCart, removeCouponFromCartStatus],
  } = useCartMutations();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  //   states
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const { cart } = useAppSelector((state) => state.cart.data);
  const [userCouponCode, setUserCouponCode] = useState<string>(
    cart?.applied_coupons?.[0]?.code || ""
  );

  //   features
  const addCoupon = () => {
    addCouponCodeToCart({
      variables: {
        input: {
          cart_id: cart?.id as any,
          coupon_code: userCouponCode,
        },
      },
      onCompleted(data, clientOptions) {
        if (data.applyCouponToCart.cart) {
          dispatch(updateCart(data.applyCouponToCart.cart));
          toast({
            variant: "success",
            title: "Coupon code",
            description: "Coupon added successfully",
          });
        }
      },
    });
  };
  const removeCurrentCoupon = () => {
    removeCouponFromCart({
      variables: {
        input: {
          cart_id: cart?.id as any,
        },
      },
      onCompleted(data, clientOptions) {
        if (data?.removeCouponFromCart.cart) {
          setUserCouponCode("");
          dispatch(updateCart(data.removeCouponFromCart.cart));
          toast({
            variant: "success",
            title: "coupon code",
            description: "Coupon removed successfully",
          });
        }
      },
    });
  };

  //   effects
  useEffect(() => {
    setUserCouponCode(
      (!!cart?.applied_coupons?.[0]?.code &&
        cart?.applied_coupons?.[0]?.code) ||
        ""
    );
  }, [cart]);

  return (
    <div className={`apply_coupon ${styles.apply_coupon}`}>
      <div className="promo_code">
        {/* <h4>Promo Code</h4> */}

        <form>
          <div className="input_grup">
            <Input
              type="text"
              disabled={
                !!cart?.applied_coupons?.length ||
                addCouponCodeToCartStatus.loading
              }
              value={userCouponCode || ""}
              placeholder={cart?.applied_coupons?.[0]?.code || "Coupon code"}
              onChange={(e) => {
                setUserCouponCode(e.target.value);
              }}
              className="promo_input"
            />
          </div>
          <div className="input_grup">
            <Button
              className="apply_now_button normal_btn submit_btn"
              disabled={addCouponCodeToCartStatus.loading || !!!userCouponCode}
              onClick={(e) => {
                e.preventDefault();
                !!cart?.applied_coupons?.length
                  ? removeCurrentCoupon()
                  : addCoupon();
              }}
            >
              {" "}
              {((addCouponCodeToCartStatus.loading ||
                removeCouponFromCartStatus.loading) && (
                <CircularProgress />
              )) || (
                <span>
                  {(!!cart?.applied_coupons?.length && "REMOVE COUPON") ||
                    `APPLY COUPON `}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
      {/* <div className="continue_shopping_button">
        <Link href="/">
          <button>CONTINUE SHOPPING</button>
        </Link>
      </div> */}
    </div>
  );
}

export default ApplyCoupon;
