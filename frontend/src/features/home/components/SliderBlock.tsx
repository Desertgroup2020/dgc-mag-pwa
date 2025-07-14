import { getClient } from "@/lib/apollo/client";
import React from "react";
import { SLIDER_BLOCK_QUERY, SliderBlockQuery } from "../apollo/queries";
import dynamic from "next/dynamic";
import logger from "@/lib/logger";

// import SliderBlockClient from "./client/SliderBlockClient";

const SliderBlockClient = dynamic(() => import("./client/SliderBlockClient"), {
  ssr: false,
});

export interface BlockProp {
  blockId: number;
}

async function SliderBlock({ blockId }: BlockProp) {
  const { data } = await getClient()
    .query<SliderBlockQuery["Response"], SliderBlockQuery["Variables"]>({
      query: SLIDER_BLOCK_QUERY,
      variables: {
        blockId: blockId,
      },
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  const refinedSliderBlock = data.getBlockData?.[0];

  // if (!refinedSliderBlock.desktop_status) return null;
  return (
    <div
      className={`slider_block ${
        !refinedSliderBlock.mobile_status ? " mobile_only:hidden" : !refinedSliderBlock.desktop_status ? ' desk_only:hidden' : '' 
      }`}
    >
      <SliderBlockClient sliderBlock={refinedSliderBlock} />
    </div>
  );
}

export default SliderBlock;
