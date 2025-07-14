"use client";
import React, { useEffect, useRef } from "react";
import Search from "@/features/search";
import LeftSideHeader from "./LeftSideHeader";
import RightSideHeader from "./RightSideHeader";
import headerStyles from "./styles/headerComponent.module.scss";

const HeaderComponent = () => {
  return (
    <div className="container">
      <div className={headerStyles.header}>
        <LeftSideHeader />
        <Search />
        <RightSideHeader />
      </div>
    </div>
  );
};

export default HeaderComponent;
