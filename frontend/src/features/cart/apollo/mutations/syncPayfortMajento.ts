import { gql } from "@apollo/client";

const SYNC_PAYFORT_MAJENTO = gql`
  mutation syncPayfortInfo($orderId: String!, $response: String!) {
    syncPayfortInfo(orderId: $orderId, response: $response)
  }
`;

export type SyncPayfortMajento = {
  Response: {
    syncPayfortInfo: boolean;
  };
  Variables: {
    orderId: string;
    response: string;
  };
};

export default SYNC_PAYFORT_MAJENTO
