import { GtmHeadOutput, MpGtmHeadFilters } from "@/generated/types";
import { gql } from "@apollo/client";

const GTM_CODE_HEAD = gql`
  query mpGTMHead($filters: MpGTMHeadFilters) {
    mpGTMHead(filters: $filters) {
      head
    }
  }
`;

export type GtmCodeHeadType = {
    Response: {
        mpGTMHead: GtmHeadOutput
    },
    Variables: {
        filters: MpGtmHeadFilters
    }
}

export default GTM_CODE_HEAD