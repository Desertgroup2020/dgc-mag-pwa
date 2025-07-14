"use client";

import { KeyValuePair, PlpBannerItems } from "@/app/[...slug]/page";
import {
  Aggregation,
  Breadcrumb,
  ProductInterface,
  SearchResultPageInfo,
  SortFields,
} from "@/generated/types";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import ProductNotFound from "../components/ProductNotFound";
import { useAppSelector } from "@/redux/hooks";
import { RouteQuery } from "@/features/dynamic-url/apollo/queries/route";
import FilterSkeleton from "@/components/loader/productlist/FilterSkeleton";

const FilterScreen = dynamic(() => import("./FilterScreen"), {
  ssr: false,
  loading(loadingProps) {
    return <FilterSkeleton/>;
  },
});
const ListerScreen = dynamic(() => import("./ListerScreen"), {
  ssr: false,
});

interface ProductListingClientProps {
  products: ProductInterface[] | null;
  pageInfo: SearchResultPageInfo | null;
  searchParams: KeyValuePair;
  sortFields: SortFields;
  bannerItems: PlpBannerItems;
  id: string;
  aggregations: Aggregation[];
  route: RouteQuery["Response"]["route"]
}
function ProductListingClient({
  aggregations,
  bannerItems,
  pageInfo,
  products,
  searchParams,
  sortFields,
  id,
   route
}: ProductListingClientProps) {
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const wishlist = useAppSelector(state=>state.wishlist.data);  

  // useEffect(()=>{
    // console.log("wish list from slice single item", wishlist?.items_v2?.items.find((item)=>item?.product?.sku === "I55921"));
    
  // }, [wishlist])

  return (
    <div className="divider">
      {winWidth && winWidth > 1199 ? (
        <div className="filter">
          <FilterScreen
            aggregations={aggregations as Aggregation[]}
            searchParams={searchParams}
            cat_id={id}
          />
        </div>
      ) : null}

      <div className="lister">
        {!products?.length ? (
          <ProductNotFound />
        ) : (
          <ListerScreen
            products={products as ProductInterface[]}
            pageInfo={pageInfo as SearchResultPageInfo}
            searchParams={searchParams}
            sortFields={sortFields}
            bannerItems={bannerItems}
            id={id}
            aggregations={aggregations as Aggregation[]}
            route={route}
          />
        )}
      </div>
    </div>
  );
}

export default ProductListingClient;
