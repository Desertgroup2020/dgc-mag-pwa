import Image from "next/image";
import React from "react";
import logoStyles from "../styles/logo.module.scss";
import Link from "next/link";

const LogoSection = () => {
  return (
    <div className={logoStyles.logo_wrapper}>
      <Link href={'/'}>
        <Image
          src="/assets/images/dubai-garden-centre-logo.png"
          alt="header_logo"
          width={90}
          height={90}
          className="header_logo"
          // objectFit="contain"
        />
      </Link>
    </div>
  );
};

export default LogoSection;
