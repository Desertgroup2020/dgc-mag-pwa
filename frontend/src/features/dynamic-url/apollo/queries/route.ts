import {
  CategoryTree,
  ProductInterface,
  RoutableInterface,
} from "@/generated/types";
import { gql } from "@apollo/client";

export const ROUTE = gql`
  query Route($url: String!) {
    route(url: $url) {
      redirect_code
      relative_url
      type
      ... on CmsPage {
        identifier
        meta_description
        meta_keywords
        meta_title
      }
      ... on CategoryTree {
        id
        name
        image
        description
        url_path
        url_suffix
        breadcrumbs {
          category_name
          category_uid
          category_url_path
        }
        meta_description
        meta_keywords
        meta_title
      }
      ... on SimpleProduct {
        sku
        url_path
        url_key
        name
        url_suffix
        meta_description
        meta_title
      }
      ... on ConfigurableProduct {
        sku
        url_path
        name
        url_key
        url_suffix
        meta_description
        meta_title
      }
    }
  }
`;

export type RouteQuery = {
  Response: {
    route:
      | (RoutableInterface &
          CategoryTree & {
            cat_image: string;
          } & ProductInterface)
      | null;
  };
  Variables: {
    url: string;
  };
};
