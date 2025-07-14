// export const revalidate = 60;

import ProductDisplaySkeleton from "@/components/loader/productdisplay/ProductDisplaySkeleton";
import ProductListSkeleton from "@/components/loader/productlist/ProductListSkeleton";
import CmsPage from "@/features/cms-pages/screens/CmsPage";
import { ROUTE, RouteQuery } from "@/features/dynamic-url/apollo/queries/route";
import ProductDetails from "@/features/product-details/ProductDetails";
import ProductListing from "@/features/product-listing/ProductListing";
import ViewAllProducts from "@/features/view-all-products/ViewAllProducts";
import {
  CmsPage as CmsPageType,
  ProductInterface,
} from "@/generated/types";
import { getClient } from "@/lib/apollo/client";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export interface KeyValuePair {
  [key: string]: string | string[];
}
export interface DefaultProps {
  params: {
    slug: string[];
  };
  searchParams: KeyValuePair;
}
export interface PlpBannerItems {
  image: string | null;
  name: string | null;
  desc: string | null;
}

export async function generateMetadata({
  params,
  searchParams,
}: DefaultProps): Promise<Metadata> {
  //   console.log("params in meta", params);
  //   console.log("searchParams in meta", searchParams);
  const client = getClient();
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const pathname = params.slug?.join("/");
  const paramUrl = params.slug?.[0];
  // console.log("paramUrl",paramUrl);

  const currentUrl = `${protocol}://${host}/${paramUrl}`;
  // const pathname = params.slug.join("/");
  const routeDetailsResponse = await client.query<
    RouteQuery["Response"],
    RouteQuery["Variables"]
  >({
    query: ROUTE,
    variables: {
      url: pathname,
    },
  });
  const routeDetails = routeDetailsResponse.data.route;
  //   console.log("routeDetails", routeDetails);

  if (routeDetails?.type === "CATEGORY") {
    return {
      title:
        (routeDetails as ProductInterface)?.meta_title || (routeDetails as ProductInterface)?.name ||  "Dubai Garden Centre",
      description:
        (routeDetails as ProductInterface)?.meta_description ||
        "Buy Plants Online with Dubai Garden Centre, Best Online Plants Supplier in Dubai, Abu Dhabi UAE with wide range of fresh Outdoor and Indoor Plants. Buy all types of indoor & outdoor plants online. We also have a physical Store Situated on Sheikh Zayed roa",
      keywords: (routeDetails as ProductInterface)?.meta_keyword,
      openGraph: {
        title: (routeDetails as ProductInterface)?.meta_title || "",
        description: (routeDetails as ProductInterface)?.meta_description || "",
        siteName: "Dubai Garden Centre",
        type: "website",
      },
      alternates: {
        canonical: currentUrl,
      },
    };
  }
  if (routeDetails?.type === "PRODUCT") {
    return {
      title:
        (routeDetails as ProductInterface)?.meta_title ||
        (routeDetails as ProductInterface).name ||
        "Dubai Garden Centre",
      description:
        (routeDetails as ProductInterface)?.meta_description ||
        "Buy Plants Online with Dubai Garden Centre, Best Online Plants Supplier in Dubai, Abu Dhabi UAE with wide range of fresh Outdoor and Indoor Plants. Buy all types of indoor & outdoor plants online. We also have a physical Store Situated on Sheikh Zayed roa",
      keywords:
        (routeDetails as ProductInterface)?.meta_keyword ||
        "Dubai Garden Centre",
      openGraph: {
        title: (routeDetails as ProductInterface)?.meta_title || "",
        description: (routeDetails as ProductInterface)?.meta_description || "",
        siteName: "Dubai Garden Centre",
        type: "website",
      },
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  return {
    title: (routeDetails as CmsPageType)?.meta_title || "Dubai Garden Centre",
    description:
      (routeDetails as CmsPageType)?.meta_description ||
      "Buy Plants Online with Dubai Garden Centre, Best Online Plants Supplier in Dubai, Abu Dhabi UAE with wide range of fresh Outdoor and Indoor Plants. Buy all types of indoor & outdoor plants online. We also have a physical Store Situated on Sheikh Zayed roa",
    keywords:
      (routeDetails as CmsPageType)?.meta_keywords || "Dubai Garden Centre",
    openGraph: {
      title: (routeDetails as CmsPageType)?.meta_title || "",
      description: (routeDetails as CmsPageType)?.meta_description || "",
      siteName: "Dubai Garden Centre",
      type: "website",
    },
    alternates: {
      canonical: currentUrl,
    },
  };
}

async function page({ params, searchParams }: DefaultProps) {
  {
    /* {`params: ${JSON.stringify(params?.slug)}`} */
  }
  {
    /* {`search params: ${JSON.stringify(searchParams)}`} */
  }
  const client = getClient();
  const pathname = params.slug.join("/");
  const brandId = params.slug?.[params.slug.length - 1];

  // console.log("pathname", pathname);
  console.log("revalildation happens after 60s slug");
  

  const response = await client.query<
    RouteQuery["Response"],
    RouteQuery["Variables"]
  >({
    query: ROUTE,
    variables: {
      url: pathname,
    },
  });

  const route: RouteQuery["Response"]["route"] =
    pathname === "search"
      ? ({
          type: "CATEGORY",
          name: "Search",
        } as any)
      : pathname === `brands/${brandId}`
      ? {
          type: "CATEGORY",
          name: "Brand",
        }
      : pathname === `view-all-products/${brandId}`
      ? {
          type: "VIEW_ALL",
          name: "All Products",
        }
      : response.data.route;

  switch (route?.type as "CATEGORY" | "PRODUCT" | "CMS_PAGE" | "VIEW_ALL") {
    case "CATEGORY":
      return (
        <Suspense fallback={<ProductListSkeleton />}>
          {/* <ProductListSkeleton/> */}
          <ProductListing
            params={params}
            searchParams={searchParams}
            pathname={pathname}
            id={route?.id?.toString() as string}
            bannerItems={{
              image: route?.image || null,
              name: route?.name || null,
              desc: route?.description || null,
            }}
            route={route as RouteQuery["Response"]["route"]}
          />
          {/* <ComingSoon /> */}
        </Suspense>
      );

    case "PRODUCT":
      return (
        <Suspense fallback={<ProductDisplaySkeleton />}>
          <ProductDetails
            params={params}
            searchParams={searchParams}
            pathname={pathname}
            sku={route?.sku as string}
            route={route as RouteQuery["Response"]["route"]}
          />
        </Suspense>
      );

    case "CMS_PAGE":
      return (
        <Suspense fallback={<h1>CMS loader...</h1>}>
          <CmsPage
            identifier={(route as CmsPageType).identifier as string}
            slug={params.slug}
          />
        </Suspense>
      );

    case "VIEW_ALL":
      return (
        <Suspense fallback={<ProductListSkeleton />}>
          <ViewAllProducts
            params={params}
            searchParams={searchParams}
            pathname={pathname}
            id={route?.id?.toString() as string}
            route={route as RouteQuery["Response"]["route"]}
          />
        </Suspense>
      );
    default:
      notFound();
  }
}

export default page;
