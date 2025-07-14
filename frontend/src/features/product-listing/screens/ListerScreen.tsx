"use client";

import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Aggregation,
  Breadcrumb,
  ProductInterface,
  SearchResultPageInfo,
  SortFields,
} from "@/generated/types";
import Image from "next/image";
import React, { useState } from "react";
import ProductsHolder from "../components/ProductsHolder";
import ListViewIcon from "@/components/icons/ListViewIcon";
import GridViewIcon from "@/components/icons/GridViewIcon";
import ProductSort from "../components/ProductSort";
import { KeyValuePair, PlpBannerItems } from "@/app/[...slug]/page";
import { useAppSelector } from "@/redux/hooks";
import dynamic from "next/dynamic";
import BreadCrumbs from "@/components/breadcrumbs/BreadCrumbs";
import { RouteQuery } from "@/features/dynamic-url/apollo/queries/route";
// import MobileFilterIntiator from "../components/MobileFilterIntiator";

const MobileFilterIntiator = dynamic(
  () => import("../components/MobileFilterIntiator"),
  {
    ssr: false,
    loading(loadingProps) {
      return <span>Filter loading...</span>;
    },
  }
);

interface ListerScreenProps {
  products: ProductInterface[] | null;
  aggregations: Aggregation[];
  pageInfo: SearchResultPageInfo | null;
  searchParams: KeyValuePair;
  sortFields: SortFields;
  bannerItems: PlpBannerItems;
  id: string;
  route: RouteQuery["Response"]["route"];
}

function ListerScreen({
  pageInfo,
  products,
  searchParams,
  sortFields,
  bannerItems,
  id,
  aggregations,
  route,
}: ListerScreenProps) {
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  const [view, setView] = useState<"list" | "grid">("grid");
  const { image, desc, name } = bannerItems;
  const breadcrumbs = route?.breadcrumbs || [];
  const searchkeyWord = searchParams.keyWord;

  return (
    <div className="product_lister">
      {(image && (
        <div className="banner">
          {image ? (
            <Image
              src={image}
              alt="Banner"
              width={1127}
              height={355.5}
              className="banner_img"
            />
          ) : null}
          <div className="banner_cnt">
            {name ? <h1>{name}</h1> : null}
            {desc ? (
              <div
                className="text-cat_font"
                dangerouslySetInnerHTML={{ __html: desc }}
              ></div>
            ) : null}
            {/* <Button className="normal_btn">
              <span>shop now</span>
            </Button> */}
          </div>
        </div>
      )) || (
        <div className="title">
          <h1 className="text-h2 mb-3 sentence_case">
            {searchkeyWord ? `Search Results for ${searchkeyWord}` : name}
          </h1>
        </div>
      )}
      {winWidth && winWidth < 1199 ? (
        <BreadCrumbs
          breadcrumbs={breadcrumbs as Breadcrumb[]}
          currentItem={{
            category_uid: "",
            category_name: route?.name,
            category_url_path: route?.url_path,
            havingSuffix: !!route?.url_suffix,
          }}
        />
      ) : null}
      <div className="products_ctrls">
        {winWidth && winWidth < 1199 ? (
          <MobileFilterIntiator
            aggregations={aggregations}
            searchParams={searchParams}
            cat_id={id}
          />
        ) : null}
        <div className="breadcrumb">
          {winWidth && winWidth > 1199 ? (
            <BreadCrumbs
              breadcrumbs={breadcrumbs as Breadcrumb[]}
              currentItem={{
                category_uid: "",
                category_name: route?.name,
                category_url_path: route?.url_path,
                havingSuffix: !!route?.url_suffix,
              }}
            />
          ) : null}
        </div>
        <div className="ctrls">
          <div className="view">
            <Button
              variant={"itself"}
              onClick={() => setView("list")}
              rel="List view"
              className={view === "list" ? "active" : ""}
            >
              <ListViewIcon />
            </Button>
            <Button
              variant={"itself"}
              onClick={() => setView("grid")}
              rel="Grid view"
              className={view === "grid" ? "active" : ""}
            >
              <GridViewIcon />
            </Button>
          </div>
          <ProductSort searchParams={searchParams} sortFields={sortFields} />
        </div>
      </div>
      <ProductsHolder
        products={products}
        pageInfo={pageInfo}
        view={view}
        searchParams={searchParams}
        id={id}
        from="PLP"
      />
    </div>
  );
}

export default ListerScreen;
