import React from "react";
import { BlockProp } from "./SliderBlock";
import { getClient } from "@/lib/apollo/client";
import { CATEGORY_BLOCK_QUERY, CategoryBlockQuery } from "../apollo/queries";
import categoryBlockStyles from "../styles/categoryblock.module.scss";
import dynamic from "next/dynamic";
import logger from "@/lib/logger";

const CategoryBlockClient = dynamic(
  () => import("./client/CategoryBlockClient"),
  { ssr: false }
);

async function CategoryBlock({ blockId }: BlockProp) {
  const { data } = await getClient()
    .query<CategoryBlockQuery["Response"], CategoryBlockQuery["Variables"]>({
      query: CATEGORY_BLOCK_QUERY,
      variables: {
        blockId: blockId,
      },
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  const refinedCategoryBlock = data.getBlockData?.[0];  
  if (!refinedCategoryBlock.desktop_status) return null;
  return (
    <div className={`category_block ${categoryBlockStyles.category_block}`}>
      <div className={`container`}>
        <h2 className=" text-h2 mb-h2_btm">Explore our top categories</h2>
        <CategoryBlockClient categoryBlock={refinedCategoryBlock} />
      </div>
    </div>
  );
}

export default CategoryBlock;
