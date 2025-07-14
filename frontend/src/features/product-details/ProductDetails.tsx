import { DefaultProps } from "@/app/[...slug]/page";
import React from "react";
import ProductDetailClient from "./screens/ProductDetailClient";
import dynamic from "next/dynamic";
import { getClient } from "@/lib/apollo/client";
import { ProductsQuery } from "../dynamic-url/apollo/queries/productPlp";
import PRODUCTS from "../dynamic-url/apollo/queries/productPdp";
import {
  BundleProduct,
  ConfigurableProduct,
  ProductInterface,
} from "@/generated/types";
import { RouteQuery } from "../dynamic-url/apollo/queries/route";
// import  BundleContextProvider  from "./components/bundle/hooks/bundleContext";
// import ConfigurableContextProvider from "./components/configurable/configurableContext";

const PdpContextProvider = dynamic(() => import("./hooks/pdpContext"), {
  ssr: false,
});
const ConfigurableContextProvider = dynamic(
  () => import("./components/configurable/configurableContext"),
  {
    ssr: false,
  }
);
const BundleContextProvider = dynamic(
  () => import("./components/bundle/hooks/bundleContext"),
  {
    ssr: false,
  }
);

interface ProductDetailsProps extends DefaultProps {
  sku: string;
  pathname: string;
  route: RouteQuery["Response"]["route"];
}

async function ProductDetails({ sku, route }: ProductDetailsProps) {
  const response = await getClient()
    .query<ProductsQuery["Response"], ProductsQuery["Variables"]>({
      query: PRODUCTS,
      variables: {
        currentPage: 1,
        filter: {
          sku: {
            eq: sku,
          },
        },
      },
      fetchPolicy: "no-cache",
    })
    .catch((err) => {
      throw err;
    });
  const product = response.data.products.items?.[0] as ProductInterface & {
    __typename: string;
  };

  return (
    <PdpContextProvider product={product}>
      {/* <div className="container"> */}
      <ConfigurableContextProvider
        product={product as ConfigurableProduct & { __typename: string }} //assuming that incoming product is Configurable
      >
        <BundleContextProvider
          product={product as BundleProduct & { __typename: string }} //assuming that incoming product is Bundle
        >
          <ProductDetailClient route={route} product={product} />
        </BundleContextProvider>
      </ConfigurableContextProvider>
      {/* </div> */}
    </PdpContextProvider>
  );
}

export default ProductDetails;
