import React from "react";
import { BlockProp } from "./SliderBlock";
import { getClient } from "@/lib/apollo/client";
import { POPUP_BLOCK, PopUpBlockQuery } from "../apollo/queries";
import logger from "@/lib/logger";
import PopupClient from "./client/popup-block/PopupClient";

async function PopupBlock({ blockId }: BlockProp) {
  const { data } = await getClient()
    .query<PopUpBlockQuery["Response"], PopUpBlockQuery["Variables"]>({
      query: POPUP_BLOCK,
      variables: {
        blockId: blockId,
      },
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  const refinedPopupBlock = data.getBlockData?.[0];
  // console.log("refined product block", refinedProductBlock);

  if (!refinedPopupBlock.desktop_status) return null;
  return <PopupClient popUpData={refinedPopupBlock} />;
}

export default PopupBlock;
