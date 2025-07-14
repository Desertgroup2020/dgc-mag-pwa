import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import mobileHeaderStyles from "../styles/mobileHeader.module.scss";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import AccountBtn from "../components/AccountBtn";
import LoginBtn from "../components/LoginBtn";
import SiteSheet from "@/components/reusable-uis/SiteSheet";
// import MobileMenuContents from "../Category/MobileMenuContents";
import Link from "next/link";
import CategorySkeleton from "@/components/loader/CategorySkeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CircularProgress from "@/components/icons/CircularProgress";
import CartBtn from "../components/CartBtn";
// import Search from "@/features/search";

const DynamicNavIcon = dynamic(() => import("../../icons/NavIcon"));
const DynamicSearchIcon = dynamic(() => import("../../icons/MobileSearch"));
const DynamicCartIcon = dynamic(() => import("../../icons/ShoppingCart"));
const MobileMenuContents = dynamic(
  () => import("../Category/MobileMenuContents")
);
const DynamicWholesaleIcon = dynamic(
  () => import("../../icons/WholesaleIcon"),
  { loading: () => <CircularProgress /> }
);
const Search = dynamic(() => import("@/features/search"), { ssr: false });

const MobileHeader = () => {
  // hooks
  const isCartUpdating = useAppSelector(
    (state) => state.cart.updatingCart || state.cart.status === "loading"
  );

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const onOpenChange = (open: boolean) => {
    setMobileMenuVisible((prev) => !prev);
  };
  const { token } = useAppSelector((state) => state.auth);
  const [popOpen, setPopOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", isSticky);

    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, []);

  const isSticky = () => {
    // const headerResponsive = document.querySelector('.header_main_wrapper');
    const header = document.querySelector(".mobile_header_section");
    const scrollTop = window.scrollY;
    scrollTop >= 100
      ? header?.classList.add("header-isSticky")
      : header?.classList.remove("header-isSticky");
  };

  return (
    <>
      {/* {!mobileMenuVisible ? ( */}
      <div className={mobileHeaderStyles.mobile_header_section}>
        <div className="top_header"></div>
        <div className="main_header">
          <button
            onClick={() => setMobileMenuVisible(true)}
            className="respnsive_menu_button"
          >
            <DynamicNavIcon />
          </button>
          <div>
            <Link href={"/"}>
              <Image
                src="/assets/images/mobile-logo.png"
                width="50"
                height="50"
                alt="mobile-logo"
              />
            </Link>
          </div>
          <div className="mobile_icons">
            <Button variant={"itself"}>
              {/* <DynamicSearchIcon width={20} height={20} /> */}
              <Popover open={popOpen}>
                <PopoverTrigger
                  className="flex items-center"
                  onClick={() => setPopOpen(true)}
                >
                  <DynamicSearchIcon width={20} height={20} />
                </PopoverTrigger>
                <PopoverContent
                  className="search_mobile_icon_popover"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onInteractOutside={(e) => {
                    setPopOpen(false);
                  }}
                >
                  <div className={`mobile_search_screen`}>
                    <Suspense fallback={null}>
                      <Search />
                    </Suspense>
                  </div>
                </PopoverContent>
              </Popover>
            </Button>

            {isCartUpdating ? (
              <CircularProgress />
            ) : (
              <CartBtn />
            )}

            {token ? <AccountBtn /> : <LoginBtn />}
          </div>
        </div>
      </div>
      <SiteSheet
        opts={{ open: mobileMenuVisible, onOpenChange: onOpenChange }}
        title="Categories"
        position="left"
        className={"menu_sheet"}
      >
        <Suspense fallback={<CategorySkeleton noOfItems={13} />}>
          <div className="mobile_content_wraper">
            <MobileMenuContents handleClose={onOpenChange} />
            {(!token && (
              <div className="wholesale_icon_section">
                <Link
                  href={"/b2b-register"}
                  className="flex items-center"
                  onClick={() => setMobileMenuVisible(false)}
                >
                  <DynamicWholesaleIcon stroke="#fff" className=" mr-1" />
                  <span className="wholesale_icon_text">B2B Registration</span>
                  <LogIn width={20} height={20} className="ml-4" />
                </Link>
              </div>
            )) ||
              null}
          </div>
        </Suspense>
      </SiteSheet>
    </>
  );
};

export default MobileHeader;
