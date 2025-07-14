import { CmsPage } from "@/generated/types";
import { gql } from "@apollo/client";

const CMS_PAGE = gql`
  query getCmsPage($identifier: String) {
    cmsPage(identifier: $identifier) {
      content
      content_heading
      identifier
      meta_description
      meta_keywords
      meta_title
      page_layout
      relative_url
      title
      type
      url_key
    }
  }
`;

export type CmsPageType = {
    Response:{
        cmsPage: CmsPage
    },
    Variables: {
        identifier: string
    }
}

export default CMS_PAGE
