import SiteSheet from "@/components/reusable-uis/SiteSheet";
// import MiniCart from "@/features/cart/components/MiniCart";
import { useAppSelector } from "@/redux/hooks";
import { usePrice } from "@/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DynamicCartIcon = dynamic(() => import("../../icons/ShoppingCart"));
const MiniCart = dynamic(() => import("@/features/cart/components/MiniCart"), {
  loading: () => <span>loading...</span>,
});

function CartBtn() {
  const { renderPrice } = usePrice();

  // states
  const cart = useAppSelector((state) => state.cart.data.cart);
  const [sheetOpen, setSheetOpen] = useState(false);

  //features
  const onOpenChange = () => {
    setSheetOpen((prev) => !prev);
  };

  //effects
  useEffect(()=>{
    if(cart && !cart?.itemsV2?.items.length){
      setSheetOpen(false);
    }
  }, [cart])

  return (
    <>
      <Link
        href={"/shopping-cart"}
        className="cart_icon_section"
        onClick={(e) => {
          if (cart?.itemsV2?.items.length) {
            e.preventDefault();
            onOpenChange();
          }
        }}
      >
        <button>
          {cart?.itemsV2?.items.length ? (<span className="flag"></span>):null}
          <DynamicCartIcon />
        </button>

        {cart?.itemsV2?.items.length ? (
          <span className="cart_price_text">
            {" "}
            {renderPrice(cart?.prices?.grand_total?.value || 0)}
          </span>
        ) : null}
      </Link>

      <SiteSheet
        opts={{ open: sheetOpen, onOpenChange: onOpenChange }}
        title="Shopping cart"
        position="right"
        className={"mini_cart_sheet"}
      >
        <MiniCart handleClose={onOpenChange} />
      </SiteSheet>
    </>
  );
}

export default CartBtn;
