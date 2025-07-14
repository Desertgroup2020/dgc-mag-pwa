import React from "react";
// import StaticBlock from '../StaticBlock'
import BottomFooter from "./BottomFooter";
import dynamic from "next/dynamic";

const StaticBlock = dynamic(() => import("../StaticBlock"), {
  ssr: true,
  loading(loadingProps) {
    return <span>loading...</span>;
  },
});

const FooterComponent = () => {
  return (
    <div className="footer_container">
      <StaticBlock />
      <BottomFooter />
    </div>
  );
};

export default FooterComponent;
