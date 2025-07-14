import { CmsBlocks } from "@/generated/types";
import { gql } from "@apollo/client";

const CMS_BLOCK = gql`
  query cmsBlocks($identifiers: [String]) {
    cmsBlocks(identifiers: $identifiers) {
      items {
        content
        identifier
        title
      }
    }
  }
`;

export type CmsBlockQueryType = {
    Response: {
        cmsBlocks: CmsBlocks
    },
    Variables: {
        identifiers: string[]
    }
}

export default CMS_BLOCK
