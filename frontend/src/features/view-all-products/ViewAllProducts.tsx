import { DefaultProps } from "@/app/[...slug]/page";
import React from "react";
import { RouteQuery } from "../dynamic-url/apollo/queries/route";
import { getClient } from "@/lib/apollo/client";
import VIEW_ALL_PRODUCTS, {
  ViewAllProductsType,
} from "./query/viewallProducts";
import { getSort } from "../dynamic-url/utils/utils";
import ViewAllClient from "./components/ViewAllClient";
import { ProductInterface } from "@/generated/types";
import styles from '../product-listing/styles/style.module.scss';

interface ViewAllProductsProps extends DefaultProps {
  id: string;
  pathname: string;
  route: RouteQuery["Response"]["route"];
  // breadcrumbs: Breadcrumb[] | [];
}
async function ViewAllProducts({
  id,
  params,
  route,
  searchParams,
}: ViewAllProductsProps) {
  const blockId = parseInt(params.slug?.[params.slug.length - 1]);

  const response = await getClient()
    .query<ViewAllProductsType["Response"], ViewAllProductsType["Variables"]>({
      query: VIEW_ALL_PRODUCTS,
      variables: {
        currentPage: 1,
        pageSize: 12,
        input: {
          Id: blockId,
        },
        sort: getSort({ ...searchParams }) as any,
      },
      fetchPolicy: "no-cache",
    })
    .catch((err) => {
      throw err;
    });

  const products = response.data.viewallProducts.products;
  const pageInfo = response.data.viewallProducts.page_info!;

  return (
    <div className={`view_all_screen ${styles.product_listing_page}`}>
      <div className="container">
        <ViewAllClient
          id={blockId}
          pageInfo={pageInfo}
          products={products as ProductInterface[]}
          route={route}
          searchParams={searchParams}

        />
      </div>
    </div>
  );
}

export default ViewAllProducts;
