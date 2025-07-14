import { gql } from "@apollo/client";
import {
  BannerBlock,
  CategoryBlock,
  FeaturedBrandsBlock,
  PopUp,
  ProductBlock,
  SliderBlock,
  TaggedImageBlock,
  TestimonialBlock,
} from "./fragments";
import {
  CategoryBlock as CategoryBlockUi,
  HomePage,
  SliderBlock as SliderBlockUi,
  ProductBlock as ProductBlockUi,
  TaggedImageBlock as TaggedImageBlockUi,
  BannerBlock as BannerBlockUi,
  FeaturedBrandsBlock as FeaturedBrandsBlockUi,
  TestimonialBlock as TestimonialBlockUi,
  PopUp as PopUpBlockUi,
} from "@/generated/types";

export const HOME_PAGE_BASE_QUERY = gql`
  query homePage($page: Int, $size: Int) {
    homepage {
      blocks(pageSize: $page, currentPage: $size) {
        seo_details {
          meta_description
          meta_keywords
          meta_title
          miscellaneous_html
        }
        data {
          __typename
          id
        }
      }
    }
  }
`;
export const SLIDER_BLOCK_QUERY = gql`
  ${SliderBlock}
  query getBlockData($blockId: Int!) {
    getBlockData(blockId: $blockId) {
      ...SliderBlock
    }
  }
`;
export const CATEGORY_BLOCK_QUERY = gql`
  ${CategoryBlock}
  query getBlockData($blockId: Int!) {
    getBlockData(blockId: $blockId) {
      ...CategoryBlock
    }
  }
`;
export const PRODUCT_BLOCK_QUERY = gql`
  ${ProductBlock}
  query getBlockData($blockId: Int!) {
    getBlockData(blockId: $blockId) {
      ...ProductBlock
    }
  }
`;
export const TAGED_IMAGE_BLOCK_QUERY = gql`
  ${TaggedImageBlock}
  query getBlockData($blockId: Int!) {
    getBlockData(blockId: $blockId) {
      ...TaggedImageBlock
    }
  }
`;
export const BANNER_BLOCK = gql`
  ${BannerBlock}
  query getBlockData($blockId: Int!) {
    getBlockData(blockId: $blockId) {
      ...BannerBlock
    }
  }
`;
export const FEATURED_BRANDS_BLOCK_QUERY = gql`
  ${FeaturedBrandsBlock}
  query getBlockData($blockId: Int!) {
    getBlockData(blockId: $blockId) {
      ...FeaturedBrandsBlock
    }
  }
`;
export const TESTIMONIAL_BLOCK_QUERY = gql`
  ${TestimonialBlock}
  query getBlockData($blockId: Int!) {
    getBlockData(blockId: $blockId) {
      ...TestimonialBlock
    }
  }
`;
export const POPUP_BLOCK = gql`
  ${PopUp}
  query getBlockData($blockId: Int!) {
    getBlockData(blockId: $blockId) {
      ...PopUp
    }
  }
`;

export type HomePageQuery = {
  Response: {
    homepage: HomePage;
  };
  Variables: {
    page?: number;
    size?: number;
  };
};

export type SliderBlockQuery = {
  Variables: {
    blockId: number;
  };
  Response: {
    getBlockData: SliderBlockUi[];
  };
};
export type CategoryBlockQuery = {
  Variables: {
    blockId: number;
  };
  Response: {
    getBlockData: CategoryBlockUi[];
  };
};
export type ProductBlockQuery = {
  Variables: {
    blockId: number;
  };
  Response: {
    getBlockData: ProductBlockUi[];
  };
};
export type TaggedImageBlockQuery = {
  Variables: {
    blockId: number;
  };
  Response: {
    getBlockData: TaggedImageBlockUi[];
  };
};
export type BannerBlockQuery = {
  Variables: {
    blockId: number;
  };
  Response: {
    getBlockData: BannerBlockUi[];
  };
};

export type FeaturedBrandsBlockQuery = {
  Variables: {
    blockId: number;
  };
  Response: {
    getBlockData: FeaturedBrandsBlockUi[];
  };
};
export type TestimonialBlockQuery = {
  Variables: {
    blockId: number;
  };
  Response: {
    getBlockData: TestimonialBlockUi[];
  };
};
export type PopUpBlockQuery = {
  Variables: {
    blockId: number;
  };
  Response: {
    getBlockData: PopUpBlockUi[];
  };
};
