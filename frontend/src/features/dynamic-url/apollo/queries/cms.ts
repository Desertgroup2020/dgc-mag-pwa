import { CmsPage } from "@/generated/types";
import { gql } from "@apollo/client";

const CMS_PAGE = gql`
  query CmsPage($identifier: String) {
    cmsPage(identifier: $identifier) {
      identifier
      url_key
      title
      content
      content_heading
      page_layout
      meta_title
      meta_description
      meta_keywords
    }
  }
`;

export default CMS_PAGE

export type CMS_PAGE_TYPE = {
    Response:{
        cmsPage: CmsPage
    },
    Variables: {
        identifier: string
    }
}
