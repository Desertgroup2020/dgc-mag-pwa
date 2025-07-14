import { gql } from "@apollo/client";
import { TYPESENSE_CONFIG_FRAGMENT } from "@/features/store-config/apollo/fragment";

export const GET_TYPESENSE_CONFIG = gql`
  ${TYPESENSE_CONFIG_FRAGMENT}
  query GetStoreConfig {
    storeConfig {
      ...typesense_config
    }
  }
`;

export type GetTypesenseConfig = {
  Response: {
    storeConfig?: {
      typesense_config?: {
        enable_category: boolean;
        enable_frontend: boolean;
        enable_suggestions: boolean;
        highlights: string;
        index_prefix: string;
        nb_of_categories_suggestions: string;
        nb_of_products_suggestions: string;
        nb_of_suggestions_count: string;
        nearest_node: string;
        node: string;
        port: string;
        protocol: string;
        search_key: string;
      };
    };
  };
  Variables: {};
};

export interface SearchResult {
  document: {
    id?: string;
    uid?: string;
    name?: string;
    description?: string;
    sku?: string;
    image_url?: string;
    url_key?: string;
    price?: number;
    categories?: { name: string }[];
  };
}

export interface UseSearchReturn {
  query: string;
  setQuery: (value: string) => void;
  results: SearchResult[];
  resultLoading: boolean;
  resultError: string | null;
  showResults: boolean;
  setShowResults: (value: boolean) => void;
  searchSuggestions?: SearchSuggestion[];
  resultCategory?: SearchSuggestion[];
  resultSuggestion?: SearchSuggestion[];
}

export interface SearchSuggestion {
  document: {
    count?: number;
    id?: string;
    q?: string;
    path?: string;
    name?: string;
  };
  highlight?: {
    q?: {
      matched_tokens: string[];
      snippet: string;
    };
    name?: {
      snippet: string;
    };
  };
  highlights?: {
    field: string;
    matched_tokens: string[];
    snippet: string;
  }[];
  text_match?: number;
  text_match_info?: {
    best_field_score?: string;
    best_field_weight?: number;
    fields_matched?: number;
    num_tokens_dropped?: number;
    score?: string;
    tokens_matched?: number;
    typo_prefix_score?: number;
  };
}
