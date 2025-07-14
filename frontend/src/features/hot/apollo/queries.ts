import { CmsBlocks } from "@/generated/types";
import { gql } from "@apollo/client";

const GET_CMS_BLOCKS = gql`
  query getCmsBlock($identifiers: [String]) {
    cmsBlocks(identifiers: $identifiers) {
      items {
        content
        identifier
        title
      }
    }
  }
`;

export type GetCmsBlocksType = {
  Response: {
    cmsBlocks: CmsBlocks;
  };
  Variables: {
    identifiers: string[];
  };
};

export default GET_CMS_BLOCKS;
