import React from "react";
import { BlockProp } from "./SliderBlock";
import { getClient } from "@/lib/apollo/client";
import logger from "@/lib/logger";
import {
  FEATURED_BRANDS_BLOCK_QUERY,
  FeaturedBrandsBlockQuery,
} from "../apollo/queries";
import dynamic from "next/dynamic";

const BrandCarousel = dynamic(() => import("./client/BrandCarouselClient"), {
  ssr: false,
});

async function BrandBlock({ blockId }: BlockProp) {
  const { data } = await getClient()
    .query<
      FeaturedBrandsBlockQuery["Response"],
      FeaturedBrandsBlockQuery["Variables"]
    >({
      query: FEATURED_BRANDS_BLOCK_QUERY,
      variables: {
        blockId: blockId,
      },
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  const refinedBrandBlock = data.getBlockData?.[0];
  if (!refinedBrandBlock.desktop_status) return null;
  return (
    <div className="brand_block">
      <div className="container">
        <BrandCarousel featuredBrandsBlock={refinedBrandBlock} />
      </div>
    </div>
  );
}

export default BrandBlock;
