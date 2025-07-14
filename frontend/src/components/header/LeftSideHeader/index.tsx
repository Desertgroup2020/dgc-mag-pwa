import React from "react";
import LogoSection from "./LogoSection";
import Categories from "../Category";
import Menu from "./Menu";

const LeftSideHeader = () => {
  return (
    <div className="flex items-center">
      <LogoSection />
      <Categories />
      <Menu />
    </div>
  );
};

export default LeftSideHeader;
