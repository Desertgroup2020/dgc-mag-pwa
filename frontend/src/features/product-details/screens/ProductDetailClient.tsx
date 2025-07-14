"use client";

import React, { useEffect, useLayoutEffect } from "react";
import styles from "../styles/style.module.scss";
import MediaScreen from "./MediaScreen";
import { RouteQuery } from "@/features/dynamic-url/apollo/queries/route";
import BreadCrumbs from "@/components/breadcrumbs/BreadCrumbs";
import DetailsHolder from "../components/DetailsHolder";
import { Breadcrumb, ProductInterface } from "@/generated/types";
import useProduct from "@/components/product/useProduct";
import useDynamic from "@/features/dynamic-url/hooks/useDynamic";
import { useAppSelector } from "@/redux/hooks";
import dynamic from "next/dynamic";
import useGtm from "@/features/google-tag/hooks/useGtm";

interface ProductDetailClientProps {
  route: RouteQuery["Response"]["route"];
  product: ProductInterface;
}

const UpsellProducts = dynamic(() => import("../components/UpsellProducts"));
const DetailTabs = dynamic(() => import("../components/DetailTabs"));
const DetailAccordion = dynamic(
  () => import("../components/details/DetailAccordion")
);

function ProductDetailClient({ route, product }: ProductDetailClientProps) {
  // hooks
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const { breadCrumbs, upSellingProducts, relatedProducts } = useProduct({
    product,
  });
  const {
    setProductViewReport: [setProductViewReport, setProductViewReportStatus],
  } = useDynamic();
  const { gtagItemViewEvent } = useGtm();
  const { title, sku } = useProduct({ product });

  //effects
  useLayoutEffect(() => {
    setTimeout(() => {
      setProductViewReport({
        variables: {
          sku: product.sku!,
        },
      });
    }, 4000);
  }, [product.sku, setProductViewReport]);

  useEffect(() => {
    if (product) {
      gtagItemViewEvent({ product });
    }
  }, [product]);

  // console.log("product", product);

  return (
    <div className={`product_details ${styles.product_details}`}>
      <div className="container">
        <BreadCrumbs
          breadcrumbs={breadCrumbs?.length ? (breadCrumbs as Breadcrumb[]) : []}
          currentItem={{
            havingSuffix: !!route?.url_suffix,
            category_url_path: route?.url_key,
            category_name: route?.name,
            category_uid: "",
          }}
        />
        {(winWidth && winWidth) <= 991 ? (
          <div className="headings">
            <h1 className="text-h1">{title}</h1>
            <div className="sku">
              <span className="label">Item Code:&nbsp;</span>
              <span className="value">{sku}</span>
            </div>
          </div>
        ) : null}
        <div className="divider">
          <div className="col">
            <MediaScreen product={product} />
          </div>
          <div className="col">
            <div className={`contents ${styles.contents}`}>
              <DetailsHolder product={product} />
            </div>
          </div>
        </div>
      </div>
      {winWidth && winWidth < 768 ? (
        <DetailAccordion product={product} />
      ) : (
        <DetailTabs product={product} />
      )}

      {/* related products products */}
      {relatedProducts?.length ? (
        <UpsellProducts
          products={relatedProducts as ProductInterface[]}
          title={`Related products`}
        />
      ) : null}
      {/* Up selling products */}
      {upSellingProducts?.length ? (
        <UpsellProducts
          products={upSellingProducts as ProductInterface[]}
          title={`You may also like`}
        />
      ) : null}
    </div>
  );
}

export default ProductDetailClient;
