// using this mutation we can request mltiple page view scripts

import { GtmCodeOutput, MpGtmCodeFilters } from "@/generated/types";
import { gql } from "@apollo/client";

const MP_GTM_CODE = gql`
  query mpGTMCode($filters: MpGTMCodeFilters) {
    mpGTMCode(filters: $filters) {
      code
    }
  }
`;

export type GetGtmCodeType = {
  Response: {
    mpGTMCode: GtmCodeOutput;
  };
  Variables: {
    filters: MpGtmCodeFilters;
  };
};

export default MP_GTM_CODE
