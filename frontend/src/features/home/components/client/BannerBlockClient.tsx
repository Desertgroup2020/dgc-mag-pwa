"use client";

import { BannerBlock, LinkItems } from "@/generated/types";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import useHomepage from "../../utils/useHomepage";
import dynamic from "next/dynamic";

const BtnRightArrow = dynamic(() => import("@/components/icons/BtnRightArrow"));

interface BannerBlockClientProp {
  bannerBlock: BannerBlock;
}

const BannerLinkMaker = ({ linkInfo }: { linkInfo: LinkItems }) => {
  const { getBlockRedirectLink } = useHomepage();
  return (
    <Link
      href={getBlockRedirectLink(linkInfo) || "/"}
      rel="banner"
      className="shop_now_btn"
    >
      <BtnRightArrow fill="#7e8b53" stroke="#7e8b53" className="icon" />
      <span>Shop Now</span>
    </Link>
  );
};

function BannerBlockClient({ bannerBlock }: BannerBlockClientProp) {
  const isSingle = useMemo(
    () => bannerBlock.banneritems?.length === 1,
    [bannerBlock]
  );
  const singleBannerItem = bannerBlock.banneritems?.[0];

  if (isSingle)
    return (
      <div className={`singlebanner`}>
        <div className="show_now_contents">
          <h2 className="title">{singleBannerItem?.title}</h2>
          <p>{singleBannerItem?.subtitle}</p>
          <BannerLinkMaker linkInfo={singleBannerItem?.link_info!} />
          {/* <a href="">Shop Now</a> */}
        </div>
        <Image
          src={singleBannerItem?.image || ""}
          alt="banner image"
          width={801}
          height={318}
          className="shop_img_1"
        />
      </div>
    );

  return (
    <>
      <div className={`multiple`}>
        {bannerBlock.banneritems?.map((bannerItem, i) => (
          <div className="banner_item" key={i}>
            <div className="banner_item_card">
              <figure>
                <Image
                  src={bannerItem?.image || ""}
                  alt="shop-img"
                  height={318}
                  width={338}
                />
              </figure>
              <div className="shop_contents_left">
                <h2 className="title">{bannerItem?.title}</h2>
                <p>
                  {bannerItem?.subtitle}
                </p>
                <BannerLinkMaker linkInfo={bannerItem?.link_info!} />
                {/* <a href="">Shop Now</a> */}
                {/* <Link href={""} rel="banner" className="shop_now_btn">
                  <BtnRightArrow
                    fill="#7e8b53"
                    stroke="#7e8b53"
                    className="icon"
                  />
                  <span>Shop Now</span>
                </Link> */}
              </div>
            </div>
          </div>
        ))}

        {/* <div className="shop_right">
          <div className="shop_contents_right">
            <h2 className="title">Design your dream living space today</h2>
            <p>
              Design your dream living space today. Get custom made furniture as
              your needs
            </p>
            <a href="">Shop Now</a>
          </div>
          <Image src={"/shopr.png"} alt="shop-img" height={318} width={338} />
        </div> */}
      </div>
    </>
  );
}

export default BannerBlockClient;
