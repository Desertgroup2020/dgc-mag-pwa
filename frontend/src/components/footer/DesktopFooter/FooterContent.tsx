"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import footerLinks from "../footerLinks.json";
import FooterLogoSection from "./FooterLogoSection";
import { useQuery } from "@apollo/client";
import { GET_DYNAMIC_MENU_FOOTER, GetDynamicMenuType } from "../queries";
import { useAppSelector } from "@/redux/hooks";

const FooterContent = () => {
  const { token, value } = useAppSelector((state) => state.auth);

  const { data, loading } = useQuery<GetDynamicMenuType["Response"]>(
    GET_DYNAMIC_MENU_FOOTER,
    {
      fetchPolicy: "no-cache",
    }
  );

  // constants
  const isThisWholesaler = useMemo(
    () => value?.additional_info?.profile_type === "wholesaler",
    [value]
  );
  const dynamicMenuItems = useMemo(() => data?.getMenu.footerMenu, [data]);

const usefulLinks = useMemo(()=>{
  if(isThisWholesaler){
    return dynamicMenuItems?.usefulLinks?.filter(link=> link?.link !== 'b2b-register')
  }else{
    return dynamicMenuItems?.usefulLinks;
  }
}, [dynamicMenuItems, isThisWholesaler])

  return (
    <div className=" footer_content_container flex">
      <FooterLogoSection />
      <div className="flex links_wrapper">
        <div className="flex flex-col gap-1">
          <span className="links_title">Useful Links</span>
          {usefulLinks?.map((links, i) => (
            <div key={i}>
              <Link href={`/${links?.link}`}>
                <span className="label_text">{links?.text}</span>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <span className="links_title">Categories</span>
          {dynamicMenuItems?.categories?.map((links, i) => (
            <div key={i}>
              <Link href={`/${links?.link}`}>
                <span className="label_text">{links?.text}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterContent;
