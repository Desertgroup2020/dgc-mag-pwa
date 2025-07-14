"use client"

import React from "react";
import mobileFooterStyles from "../styles/mobileFooter.module.scss";
import LogoSection from "./LogoSection";
import LinksSection from "./LinksSection";
import Image from "next/image";
import NewsletterSection from "./NewsletterSection";

const MobileFooter = () => {
  return (
    <div className={mobileFooterStyles.mobile_footer_section}>
      <LogoSection />
      <LinksSection />
      <NewsletterSection  />
      <div className="flex flex-col gap-2 justify-center">
        <span className="payment_texts">Supported Payments</span>
        <div className="flex gap-3">
          <Image
            src="/assets/images/mastercard.png"
            alt="mastercard"
            width="45"
            height="35"
            className="mastercard_img"
          />
          <Image
            src="/assets/images/visa.png"
            alt="visa"
            width="45"
            height="40"
            className="visa_img"
          />
        </div>
        <div className="flex flex-col gap-2 apps_section">
          <span className="payment_texts">Get Our Apps</span>
          <div className="flex gap-2">
            <Image
              src="/assets/images/appstore.png"
              alt="app_store"
              width="90"
              height="35"
              className="appstore_img"
            />
            <Image
              src="/assets/images/googlestore.png"
              alt="google_store"
              width="80"
              height="35"
              className="appstore_img"
            />
          </div>
        </div>
        <div className="rights_section">
          <span className="rights_text">
            Copyright 2023 Dubai Garden Centre. All Rights Reserved
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;
