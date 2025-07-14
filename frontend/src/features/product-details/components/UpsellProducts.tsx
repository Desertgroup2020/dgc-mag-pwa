import { ProductInterface } from "@/generated/types";
import styles from "../../home/styles/productblock.module.scss";
import React from "react";
import { ProductCarousel } from "@/features/home/components/client/ProductBlockClient";
import Link from "next/link";
import BtnRightArrow from "@/components/icons/BtnRightArrow";

function UpsellProducts({
  products,
  title
}: {
    products: ProductInterface[];
    title: string
}) {
  return (
    <div className={`prouct_block ${styles.prouct_block}`}>
      <div className="container">
        <div className="heading flex items-start justify-between">
          <h2 className=" text-h2 mb-h2_btm">{title}</h2>
        </div>
        <ProductCarousel products={products} />
      </div>
    </div>
  );
}

export default UpsellProducts;
