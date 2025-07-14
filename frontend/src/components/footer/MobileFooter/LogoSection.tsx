import React from "react";
import logoSectionStyles from "../styles/logosection.module.scss";
import Image from "next/image";
import FooterTwitter from "@/components/icons/FooterTwitter";
import FooterYoutubeIcon from "@/components/icons/FooterYoutube";
import FooterLinkedinIcon from "@/components/icons/FooterLinkedin";
import FooterFacebookIcon from "@/components/icons/FooterFacebook";
import dynamic from "next/dynamic";

const DynamicLocationIcon = dynamic(() => import("../../icons/FooterLocation"));
const DynamiCallIcon = dynamic(() => import("../../icons/FooterCall"));
const DynamicEmailIcon = dynamic(() => import("../../icons/FooterMail"));
const DynamicFooterFacebookIcon = dynamic(
  () => import("../../icons/ResponsiveFacebookIcon")
);
const DynamicFooterLinkedinIcon = dynamic(
  () => import("../../icons/ResponsiveLinkedinIcon")
);
const DynamicFooterTwitter = dynamic(() => import("../../icons/ResponsiveTwitter"));
const DynamicFooterYoutubeIcon = dynamic(
  () => import("../../icons/ResponsiveYoutube")
);

const LogoSection = () => {
  return (
    <div className={logoSectionStyles.logo_section}>
      <div className="logo_and_social flex justify-between items-center">
        <div className="footer_logo_wrapper">
          <Image
            src="/assets/images/mobile-logo.png"
            width="50"
            height="50"
            alt="mobile-logo"
          />
        </div>
        <div className="flex gap-2 items-center">
          <DynamicFooterFacebookIcon />
          <DynamicFooterLinkedinIcon />
          <DynamicFooterTwitter />
          <DynamicFooterYoutubeIcon />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <DynamicLocationIcon />
          <span className="address_text">Sheikh zayed road, 4th interchange, Dubai</span>
        </div>
        <div className="flex gap-1">
          <DynamicEmailIcon />
          <span className="address_text">garden-centre@desertgroup.ae</span>
        </div>
        <div className="flex gap-1">
          <DynamiCallIcon />
          <span className="address_text">Call Us: 04-5904333</span>
        </div>
      </div>
    </div>
  );
};

export default LogoSection;
