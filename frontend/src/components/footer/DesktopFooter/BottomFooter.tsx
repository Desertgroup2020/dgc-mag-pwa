"use client"

import React from "react";
import FooterContent from "./FooterContent";
import NewsletterBlock from "./NewsletterBlock";

const BottomFooter = () => {
  return (
    <div className="w-full flex bottom_footer_wrapper">
      <div className="container">
        <div className="bottom_footer_inner_wrapper w-full flex justify-between">
          <FooterContent />
          <NewsletterBlock />
        </div>
      </div>
    </div>
  );
};

export default BottomFooter;
