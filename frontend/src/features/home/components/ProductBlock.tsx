import React from "react";
import { BlockProp } from "./SliderBlock";
import { getClient } from "@/lib/apollo/client";
import { PRODUCT_BLOCK_QUERY, ProductBlockQuery } from "../apollo/queries";
import productBlockStyles from "../styles/productblock.module.scss";
import logger from "@/lib/logger";
import dynamic from "next/dynamic";
import Link from "next/link";
import BtnRightArrow from "@/components/icons/BtnRightArrow";

const ProductBlockClient = dynamic(
  () => import("./client/ProductBlockClient"),
  { ssr: false }
);

async function ProductBlock({ blockId }: BlockProp) {
  const { data } = await getClient()
    .query<ProductBlockQuery["Response"], ProductBlockQuery["Variables"]>({
      query: PRODUCT_BLOCK_QUERY,
      variables: {
        blockId: blockId,
      },
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  const refinedProductBlock = data.getBlockData?.[0];
  // console.log("refined product block", refinedProductBlock);
  

  if (!refinedProductBlock.desktop_status || !refinedProductBlock.products?.length) return null;
  return (
    <div className={`prouct_block ${productBlockStyles.prouct_block}`}>
      <div className="container">
        <div className="heading flex items-start justify-between">
          <h2 className=" text-h2 mb-h2_btm">{refinedProductBlock.title}</h2>
          <Link href={`/view-all-products/${refinedProductBlock.id}`} className="view_all">
            <BtnRightArrow fill="#7e8b53" stroke="#7e8b53" className="icon" />
            <span>View all</span>
          </Link>
        </div>
        <ProductBlockClient productBlock={refinedProductBlock} />
      </div>
    </div>
  );
}

export default ProductBlock;
