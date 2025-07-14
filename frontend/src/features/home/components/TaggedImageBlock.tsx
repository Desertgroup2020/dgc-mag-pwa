import React from "react";
import { BlockProp } from "./SliderBlock";
import { getClient } from "@/lib/apollo/client";
import {
  TAGED_IMAGE_BLOCK_QUERY,
  TaggedImageBlockQuery,
} from "../apollo/queries";
import logger from "@/lib/logger";
// import TaggedImageClient from "./client/TaggedImageClient";
import styles from "../styles/taggedImage.module.scss";
import dynamic from "next/dynamic";

const TaggedImageClient = dynamic(()=> import("./client/TaggedImageClient"), {
  ssr: false,
  
});

async function TaggedImageBlock({ blockId }: BlockProp) {
  const { data } = await getClient()
    .query<
      TaggedImageBlockQuery["Response"],
      TaggedImageBlockQuery["Variables"]
    >({
      query: TAGED_IMAGE_BLOCK_QUERY,
      variables: {
        blockId: blockId,
      },
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  const refinedTaggedImageBlock = data.getBlockData?.[0];
  if (!refinedTaggedImageBlock.desktop_status) return null;
  return (
    <div className={`tagged_img_block ${styles.tagged_img_block}`}>
      <div className="container">
        <TaggedImageClient tagedImageBlock={refinedTaggedImageBlock} />
      </div>
    </div>
  );
}

export default TaggedImageBlock;
