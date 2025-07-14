import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const DynamicLocationIcon = dynamic(() => import("../../icons/FooterLocation"));
const DynamiCallIcon = dynamic(() => import("../../icons/FooterCall"));
const DynamicEmailIcon = dynamic(() => import("../../icons/FooterMail"));

const FooterLogoSection = () => {
  return (
    <div className="flex flex-col logo_container">
      <div className="flex items-center logo_wrapper">
        <Image
          src="/assets/images/logo_footer.png"
          alt="footer-logo"
          width="93"
          height="93"
        />
        <div className="flex flex-col gap-1 address_wrapper">
          <div className="flex address_section">
            <div className="flex justify-center item-center"><DynamicLocationIcon /></div>
            <span className="address_text">
              Sheikh zayed road, 4th interchange, Dubai
            </span>
          </div>
          <div className="flex address_section">
            <DynamicEmailIcon />
            <span className="address_text">garden-centre@desertgroup.ae</span>
          </div>
          <div className="flex address_section">
            <DynamiCallIcon />
            <span className="address_text">Call Us: 04-590 4333</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center">
        <span className="payment_texts">Supported Payments</span>
        <div className="flex gap-4 items-start">
          <Image
            src="/assets/images/mastercard.png"
            alt="mastercard"
            width="53"
            height="34"
            className="mastercard_img"
          />
          <Image
            src="/assets/images/visa.png"
            alt="visa"
            width="67"
            height="39"
            className="visa_img"
          />
        </div>
        <div className="flex flex-col gap-2 apps_section">
          <span className="payment_texts">Get Our Apps</span>
          <div className="flex gap-2">
            <Image
              src="/assets/images/appstore.png"
              alt="app_store"
              width="107"
              height="35"
              className="appstore_img"
            />
            <Image
              src="/assets/images/googlestore.png"
              alt="google_store"
              width="100"
              height="35"
              className="appstore_img"
            />
          </div>
        </div>
        <div className="rights_section">
          <span className="rights_text">Copyright 2024 Dubai Garden Centre. All Rights Reserved</span>
        </div>
      </div>
    </div>
  );
};

export default FooterLogoSection;
