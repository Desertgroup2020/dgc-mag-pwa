import { DefaultProps, PlpBannerItems } from "@/app/[...slug]/page";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { queriesToVariables } from "../dynamic-url/utils/utils";
import { getClient } from "@/lib/apollo/client";
import PRODUCTS, {
  ProductsQuery,
} from "../dynamic-url/apollo/queries/productPlp";
import style from "./styles/style.module.scss";
// import ProductListingClient from "./screens/ProductListingClient";
import {
  Aggregation,
  Breadcrumb,
  ProductInterface,
  RoutableInterface,
} from "@/generated/types";
import { RouteQuery } from "../dynamic-url/apollo/queries/route";
import ProductListSkeleton from "@/components/loader/productlist/ProductListSkeleton";
import logger from "@/lib/logger";

const FilterStateProvider = dynamic(
  () => import("./hooks/productFilterContext"),
  { ssr: false }
);
const ProductListingClient = dynamic(
  () => import("./screens/ProductListingClient"),
  { ssr: false, loading: () => <ProductListSkeleton /> }
);

interface ProductListingProps extends DefaultProps {
  id: string;
  pathname: string;
  bannerItems: PlpBannerItems;
  route: RouteQuery["Response"]["route"];
  // breadcrumbs: Breadcrumb[] | [];
}
async function ProductListing({
  pathname,
  id,
  searchParams,
  bannerItems,
  route,
  params,
}: ProductListingProps) {
  const brandId = params.slug?.[params.slug.length - 1];
  const variables =
    pathname === "search"
      ? queriesToVariables(searchParams)
      : pathname === `brands/${brandId}`
      ? queriesToVariables({
          ...searchParams,
          brand: brandId,
        })
      : queriesToVariables({
          ...searchParams,
          category_id: id,
        });

  const response = await getClient()
    .query<ProductsQuery["Response"], ProductsQuery["Variables"]>({
      query: PRODUCTS,
      variables,
      fetchPolicy: "no-cache",
    })
    .catch((err) => {
      logger.error("Error fetching homepage data:", err);
      throw err;
    });

  const products = response.data.products.items;
  const pageInfo = response.data.products.page_info!;
  const aggrigations = response.data.products.aggregations!;
  const sortFields = response.data.products.sort_fields!;

  console.log("search params from plp", variables); 

  // console.log("category route", route);

  return (
    <div className={`product_listing_page ${style.product_listing_page}`}>      
      <Suspense>
        <FilterStateProvider pathName={pathname} searchParams={searchParams}>
          <div className="container">
            <ProductListingClient
              aggregations={aggrigations as Aggregation[]}
              bannerItems={bannerItems}
              pageInfo={pageInfo}
              products={products as ProductInterface[]}
              searchParams={searchParams}
              sortFields={sortFields}
              id={id}
              route={route}
            />
          </div>
        </FilterStateProvider>
      </Suspense>
    </div>
  );
}

export default ProductListing;
