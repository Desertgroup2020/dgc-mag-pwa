export const dynamic = "force-dynamic";

import {
  FEATURED_BRANDS_BLOCK_QUERY,
  FeaturedBrandsBlockQuery,
} from "@/features/home/apollo/queries";
import { getClient } from "@/lib/apollo/client";
import logger from "@/lib/logger";
import styles from "../../features/brands/styles/style.module.scss";
import React from "react";
import BrandPageClient from "@/features/brands/screens/BrandPageClient";
import { notFound } from "next/navigation";

async function BrandPage() {
  const { data } = await getClient()
    .query<
      FeaturedBrandsBlockQuery["Response"],
      FeaturedBrandsBlockQuery["Variables"]
    >({
      query: FEATURED_BRANDS_BLOCK_QUERY,
      variables: {
        blockId: 12,
      },
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  const refinedBrandBlock = data.getBlockData?.[0];
  if (!refinedBrandBlock.desktop_status) notFound();
  return (
    <section className={`brand_page ${styles.brand_page}`}>
      <div className="banner">
        <div className="container">
          <h1 className="text-h1">Brands</h1>
        </div>
      </div>
      <div className="container">
        <BrandPageClient featuredBrandsBlock={refinedBrandBlock} />
      </div>
    </section>
  );
}

export default BrandPage;
