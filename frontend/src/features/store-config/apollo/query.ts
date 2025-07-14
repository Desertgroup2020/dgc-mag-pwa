import { gql } from "@apollo/client";
import { STORE_CONFIG_FRAGMENT } from "./fragment";
import {
  Country,
  Currency,
  ProductReviewRatingsMetadata,
  StoreConfig,
} from "@/generated/types";

export const GET_STORE_CONFIG = gql`
  ${STORE_CONFIG_FRAGMENT}
  query StoreConfig {
    storeConfig {
      ...StoreConfig
    }
  }
`;

export type GetStoreConfig = {
  Response: {
    storeConfig: StoreConfig;
    // availableStores: StoreConfig[];
    // currency: Currency;
    // countries: Country[];
    // productReviewRatingsMetadata: ProductReviewRatingsMetadata;
  };
  Variables: {};
};
