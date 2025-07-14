export const revalidate = 1200; // Revalidate every 20 minutes (1200 seconds)

import React, { Suspense } from "react";

import { getClient } from "@/lib/apollo/client";
import {
  HOME_PAGE_BASE_QUERY,
  HomePageQuery,
} from "@/features/home/apollo/queries";
import { Block } from "@/generated/types";
import SliderBlock from "@/features/home/components/SliderBlock";
import logger from "@/lib/logger";
import ServiceOverview from "@/features/home/components/client/ServiceOverviewClient";
import SliderBlockSkeleton from "@/components/loader/homepage/SliderBlockSkeleton";
import TopCategoryBlockSkeleton from "@/components/loader/homepage/TopCategoryBlockSkeleton";
import ProductBlockSkeleton from "@/components/loader/homepage/ProductBlockSkeleton";
import BrandBlockSkeleton from "@/components/loader/homepage/BrandBlockSkeleton";
import TestimonialBlockSkeleton from "@/components/loader/homepage/TestimonialBlockSkeleton";
import BlogPostSkeleton from "@/components/loader/homepage/BlogPostSkeleton";
import { DefaultProps } from "./[...slug]/page";
import { Metadata } from "next";
import { headers } from "next/headers";
import dynamicImport from "next/dynamic";
import { GoogleTagManager } from "@next/third-parties/google";
import PopupBlock from "@/features/home/components/PopupBlock";

const BannerBlock = dynamicImport(
  () => import("@/features/home/components/BannerBlock"),
  { ssr: true, loading: () => <h1>Banner Loader...</h1> }
);
const CategoryBlock = dynamicImport(
  () => import("@/features/home/components/CategoryBlock"),
  { ssr: true, loading: () => <TopCategoryBlockSkeleton /> }
);
const ProductBlock = dynamicImport(
  () => import("@/features/home/components/ProductBlock"),
  { ssr: true, loading: () => <ProductBlockSkeleton /> }
);
const TaggedImageBlock = dynamicImport(
  () => import("@/features/home/components/TaggedImageBlock"),
  { ssr: true, loading: () => <h1>Taged Image block Loader...</h1> }
);
const BrandBlock = dynamicImport(
  () => import("@/features/home/components/BrandBlock"),
  { ssr: true, loading: () => <BrandBlockSkeleton /> }
);
const TestimonialBlock = dynamicImport(
  () => import("@/features/home/components/TestimonialBlock"),
  { ssr: true, loading: () => <TestimonialBlockSkeleton /> }
);
const BlogPosts = dynamicImport(
  () => import("@/features/home/components/BlogPosts"),
  { ssr: true, loading: () => <BlogPostSkeleton /> }
);

interface Extendedblock extends Block {
  __typename: string;
}
interface HomeBaseQueryItem {
  __typename: string;
  id: number;
}
type SectionType =
  | "SliderBlock"
  | "BannerBlock"
  | "ContentBlock"
  | "ProductBlock"
  | "CategoryBlock"
  | "CustomBlock"
  | "TaggedImageBlock"
  | "staticConsBlock"
  | "TestimonialBlock"
  | "FeaturedBrandsBlock"
  | "BlogPostsBlock"
  | "PopUp";

const homeSectionRenderer = (data: HomeBaseQueryItem) => {
  switch (data.__typename as SectionType) {
    case "BannerBlock":
      return <BannerBlock blockId={data.id as number} />;
    case "SliderBlock":
      return (
        <Suspense fallback={<SliderBlockSkeleton />}>
          <SliderBlock blockId={data.id as number} />
        </Suspense>
      );
    case "CategoryBlock":
      return <CategoryBlock blockId={data.id as number} />;
    case "ProductBlock":
      return <ProductBlock blockId={data.id as number} />;
    case "TaggedImageBlock":
      return <TaggedImageBlock blockId={data.id as number} />;
    case "staticConsBlock":
      return <ServiceOverview />;
    case "FeaturedBrandsBlock":
      return <BrandBlock blockId={data.id as number} />;
    case "TestimonialBlock":
      return <TestimonialBlock blockId={data.id as number} />;
    case "BlogPostsBlock":
      return <BlogPosts />;
    case "PopUp":
      return <PopupBlock blockId={data.id as number} />;
    default:
      return null;
      break;
  }
};

// seo & meta
export async function generateMetadata({
  params,
}: DefaultProps): Promise<Metadata> {
  const client = getClient();
  const homeBlocksReponse = await client.query<
    HomePageQuery["Response"],
    HomePageQuery["Variables"]
  >({
    query: HOME_PAGE_BASE_QUERY,
    // fetchPolicy: "no-cache",
  });
  const homeBlocks = homeBlocksReponse.data.homepage.blocks;
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const pathname = params.slug?.join("/");
  const currentUrl = `${protocol}://${host}`;
  const url = homeBlocks?.seo_details?.miscellaneous_html?.split("href=");

  const canonicalUrl = url?.[1]
    ?.replace(/"/g, "")
    .replace(/>/g, "")
    .replace(/\s/g, "");

  if (!homeBlocks) {
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }

  return {
    title: homeBlocks.seo_details?.meta_title || "Dubai Garden Centre",
    description:
      homeBlocks.seo_details?.meta_description || "Dubai Garden Centre",
    keywords: homeBlocks.seo_details?.meta_keywords || "Dubai Garden Centre",
    openGraph: {
      title: homeBlocks.seo_details?.meta_title || "",
      siteName: "Dubai Garden Centre",
      description: homeBlocks.seo_details?.meta_description || "",
      url: currentUrl,
      type: "website",
    },
    alternates: {
      canonical: currentUrl || "",
    },
  };
}

// Fetch Homepage Data
async function fetchHomePageData() {
  const client = getClient();
  try {
    const { data } = await client.query<
      HomePageQuery["Response"],
      HomePageQuery["Variables"]
    >({
      query: HOME_PAGE_BASE_QUERY,
      fetchPolicy: "no-cache",
    });
    return data.homepage.blocks?.data as HomeBaseQueryItem[];
  } catch (err) {
    logger.error("Error fetching homepage data:", err);
    throw err;
  }
}

async function page() {
  console.log("revalildation happens after 60s home");

  const homeBlocks = await fetchHomePageData();
  // google tag call

  const shallowHomeBlocks = [...(homeBlocks as HomeBaseQueryItem[])];
  shallowHomeBlocks.splice(10, 0, {
    id: 45,
    __typename: "staticConsBlock",
  });
  shallowHomeBlocks.splice(shallowHomeBlocks.length, 0, {
    id: 50,
    __typename: "BlogPostsBlock",
  });

  return (
    <>
      <h1 style={{ display: "none" }}>Dubai Garden Centre</h1>
      {/* <GoogleTagManager gtmId="GTM-M95ZCHNW" dataLayer={dataLayer} /> */}
      {/* <GtmCodeRenderer code={gtmCode.code as string} /> */}
      {shallowHomeBlocks?.map((data) => {
        return homeSectionRenderer(data as HomeBaseQueryItem);
      })}
    </>
  );
}

export default page;
