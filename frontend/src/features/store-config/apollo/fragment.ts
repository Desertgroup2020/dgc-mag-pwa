import { gql } from "@apollo/client";

export const STORE_CONFIG_FRAGMENT = gql`
  fragment StoreConfig on StoreConfig {
    google_map_pin_address {
      latitude
      longitude
    }
  }
`;

export const TYPESENSE_CONFIG_FRAGMENT = gql`
  fragment typesense_config on StoreConfig {
    typesense_config {
      enable_category
      enable_frontend
      enable_suggestions
      highlights
      index_prefix
      nb_of_categories_suggestions
      nb_of_products_suggestions
      nb_of_suggestions_count
      nearest_node
      node
      port
      protocol
      search_key
    }
  }
`;
