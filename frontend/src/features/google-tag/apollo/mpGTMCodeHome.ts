import { GtmCodeOutput } from "@/generated/types";
import { gql } from "@apollo/client";

const GTM_CODE_HOME = gql`
  query mpGTMCodeHome {
    mpGTMCodeHome {
      code
    }
  }
`;

export type GtmCodeHomeType = {
    Response: {
        mpGTMCodeHome: GtmCodeOutput
    }
}

export default GTM_CODE_HOME
