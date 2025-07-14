import dynamic from "next/dynamic";
import React from "react";
import { BlockProp } from "./SliderBlock";
import { getClient } from "@/lib/apollo/client";
import { BANNER_BLOCK, BannerBlockQuery } from "../apollo/queries";
import logger from "@/lib/logger";
import bannerStyles from "../styles/banner_block.module.scss";

const BannerBlockClient = dynamic(() => import("./client/BannerBlockClient"), {
  ssr: false,
});

async function BannerBlock({ blockId }: BlockProp) {
  const { data } = await getClient()
    .query<BannerBlockQuery["Response"], BannerBlockQuery["Variables"]>({
      query: BANNER_BLOCK,
      variables: {
        blockId: blockId,
      },
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  const refinedBannerBlock = data.getBlockData?.[0];

  // console.log("refined banner block", refinedBannerBlock);
  
  if (
    !refinedBannerBlock.desktop_status ||
    refinedBannerBlock.title === "wordings-above-footer"
  )
    return null;
  return (
    <div
      className={`${bannerStyles.banner_block} bannerblock ${
        refinedBannerBlock.banneritems?.length !== 1 ? "multiple" : null
      }`}
    >
      <div className="container">
        <BannerBlockClient bannerBlock={refinedBannerBlock} />
      </div>
    </div>
  );
}

export default BannerBlock;
