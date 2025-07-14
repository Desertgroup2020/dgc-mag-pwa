import dynamic from "next/dynamic";
import React from "react";
import indicatorStyles from "../styles/indicator.module.scss";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
// import CartBtn from "../components/CartBtn";

type IndicatorType = "Wishlist" | "Account" | "Cart" | "Login";
interface Indicator {
  type: IndicatorType;
  component: React.ReactNode;
}

const DynamicWishlistIcon = dynamic(() => import("../../icons/WishlistIcon"), {
  loading(loadingProps) {
    return (
      <div
        className="animate-pulse span_wrapper"
        style={{
          height: 16,
          width: 18,
          background: "rgba(128, 128, 128, 0.297)",
          borderRadius: "2px",
        }}
      ></div>
    );
  },
});
const DynamicCartIcon = dynamic(() => import("../../icons/ShoppingCart"));
const CartBtn = dynamic(() => import("../components/CartBtn"), {
  ssr: false,
  loading(loadingProps) {
    return (
      <div
        className="animate-pulse span_wrapper"
        style={{
          height: 30,
          width: 100,
          background: "rgba(128, 128, 128, 0.297)",
          borderRadius: "25px",
        }}
      ></div>
    );
  },
});

const Indicators = () => {
  const cart = useAppSelector((state) => state.cart.data.cart);
  const isCartUpdating = useAppSelector(
    (state) => state.cart.updatingCart || state.cart.status === "loading"
  );
  const havingWishlist = useAppSelector(state=>state.wishlist.data?.items_v2?.items.length);

  return (
    <div className={indicatorStyles.indicator_section}>
      {/* <button> */}
      <Link href={`/my-account/wishlist`} className={`wishlist ${havingWishlist ? 'active': ''}`} >
        <DynamicWishlistIcon />
      </Link>

      {/* </button> */}
      {isCartUpdating ? (
        <div
          className="animate-pulse span_wrapper"
          style={{
            height: 30,
            width: 100,
            background: "rgba(128, 128, 128, 0.297)",
            borderRadius: "25px",
          }}
        ></div>
      ) : (
        <CartBtn />
      )}
    </div>
  );
};

export default Indicators;
