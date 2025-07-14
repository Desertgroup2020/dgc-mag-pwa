"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
// import HeaderComponent from "./HeaderComponent";
// import MobileHeader from "./mobileHeader/MobileHeader";
import headerStyles from "./styles/headerComponent.module.scss";
import { useAppSelector } from "@/redux/hooks";
import PageLoader from "./components/PageLoader";
import dynamic from "next/dynamic";
import { throttle } from "@/lib/utils";

const MobileHeader = dynamic(() => import("./mobileHeader/MobileHeader"), {
  ssr: false,
  loading: () => {
    return <div className="animate-pulse span_wrapper w-full mobile_headerloader"></div>;
  },
});
const HeaderComponent = dynamic(() => import("./HeaderComponent"), {
  ssr: false,
  loading: () => {
    return <div className="animate-pulse span_wrapper w-full desk_headerloader"></div>;
  },
});

const Header = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  const makeFixed = () => {
    const scrollPos = window.scrollY;

    if (scrollPos > 120 && headerRef.current) {
      headerRef.current.classList.add("now_fixed");
    } else {
      headerRef.current?.classList.remove("now_fixed");
    }
  };
  const resizeHandler = () => {
    const root = document.documentElement;
    root.style.setProperty(
      "--header_menu_height",
      (headerRef.current?.clientHeight + "px") as any
    );
  };
  useEffect(() => {
    window.addEventListener("scroll", makeFixed);
    window.addEventListener("resize", throttle(resizeHandler, 500));
    return () => {
      window.removeEventListener("scroll", makeFixed);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useLayoutEffect(() => {
    if (headerRef.current) {
      // console.log("working", headerRef.current?.clientHeight);

      resizeHandler();
    }
  }, []);

  return (
    <div
      className={`header_wrapper ${headerStyles.header_wrapper}`}
      ref={headerRef}
    >
      {winWidth && winWidth < 1199 ? <MobileHeader /> : <HeaderComponent />}
      <PageLoader />
    </div>
  );
};

export default Header;
