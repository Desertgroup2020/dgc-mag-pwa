"use client";

import { KeyValuePair } from "@/app/[...slug]/page";
import BreadCrumbs from "@/components/breadcrumbs/BreadCrumbs";
import GridViewIcon from "@/components/icons/GridViewIcon";
import ListViewIcon from "@/components/icons/ListViewIcon";
import { Button } from "@/components/ui/button";
import { RouteQuery } from "@/features/dynamic-url/apollo/queries/route";
import ProductsHolder from "@/features/product-listing/components/ProductsHolder";
import ProductSort from "@/features/product-listing/components/ProductSort";
import {
  ProductInterface,
  SearchResultPageInfo,
  SortFields,
} from "@/generated/types";
import { useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";

interface ViewAllClientProps {
  products: ProductInterface[] | null;
  pageInfo: SearchResultPageInfo | null;
  searchParams: KeyValuePair;
  id: number;
  route: RouteQuery["Response"]["route"];
}

function ViewAllClient({
  id,
  pageInfo,
  products,
  route,
  searchParams,  
}: ViewAllClientProps) {
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  const [view, setView] = useState<"list" | "grid">("grid");
  const breadcrumbs = route?.breadcrumbs || [];
  const sortFields: SortFields = {
    default: "position",
    options: [
      { label: "Position", value: "position", __typename: "SortField" },
      { label: "Name", value: "name", __typename: "SortField" },
      { label: "Price", value: "price", __typename: "SortField" },
      { label: "Brand", value: "brand", __typename: "SortField" },
    ],
  };

  return (
    <div className="product_lister view_all">
      <div className="title">
        <h1 className="text-h2 mb-3">{route?.name}</h1>
      </div>
      {winWidth && winWidth < 1199 ? (
        <BreadCrumbs
          breadcrumbs={[]}
          currentItem={{
            category_uid: "",
            category_name: route?.name,
            category_url_path: route?.url_path,
            havingSuffix: !!route?.url_suffix,
          }}
        />
      ) : null}
      <div className="products_ctrls">
        <div className="breadcrumb">
          {winWidth && winWidth > 1199 ? (
            <BreadCrumbs
              breadcrumbs={[]}
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
        id={""}
        from="VIEW_ALL"
        blockId={id}
      />
    </div>
  );
}

export default ViewAllClient;
