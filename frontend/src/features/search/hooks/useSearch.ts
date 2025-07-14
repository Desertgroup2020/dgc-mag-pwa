"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import axios from "axios";
import {
  GET_TYPESENSE_CONFIG,
  GetTypesenseConfig,
  SearchResult,
  UseSearchReturn,
  SearchSuggestion,
} from "../apollo/query";
import { useErrorHandler } from "@/utils";

export default function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [resultLoading, setResultLoading] = useState<boolean>(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [resultCategory, setResultCategory] = useState<SearchResult[]>([]);
  const [resultSuggestion, setResultSuggestion] = useState<SearchSuggestion[]>(
    []
  );
  const errorHandler = useErrorHandler();

  const apiKey = process.env.NEXT_PUBLIC_TYPESENSE_API_KEY;
  const host = process.env.NEXT_PUBLIC_TYPESENSE_HOST;

  const { data } = useQuery<GetTypesenseConfig["Response"]>(
    GET_TYPESENSE_CONFIG,
    {
      onError: errorHandler,
    }
  );

  const typesenseConfig = data?.storeConfig?.typesense_config;

  //console.log("typesenseConfig", typesenseConfig);

  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setResultLoading(true);
    setResultError(null);

    try {
      const response = await axios.post(
        `https://${host}/multi_search?x-typesense-api-key=${apiKey}`,
        {
          searches: [
            {
              collection: `${typesenseConfig?.index_prefix}default-products`,
              q: searchQuery,
              query_by: "name,sku,category",
              highlight_full_fields: "name,sku,category",
              page: 1,
              per_page: typesenseConfig?.nb_of_products_suggestions,
            },
            {
              collection: `${typesenseConfig?.index_prefix}default-suggestions`,
              q: searchQuery,
              query_by: "q",
              per_page: typesenseConfig?.nb_of_suggestions_count,
            },
            {
              collection: `${typesenseConfig?.index_prefix}default-categories`,
              filter_by: 'store:["default"]',
              min_len_1typo: "4",
              min_len_2typo: "4",
              num_typos: 2,
              per_page: typesenseConfig?.nb_of_categories_suggestions,
              q: searchQuery,
              query_by: "category_name,name",
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-TYPESENSE-API-KEY": apiKey || "",
          },
        }
      );

      const data = response.data;
      const searchResults: SearchResult[] = data.results?.[0]?.hits || [];
      const searchSuggestions: SearchSuggestion[] = data.results?.[1]?.hits || [];
      const searchCategory: SearchSuggestion[] = data.results?.[2]?.hits || [];

      setResults(searchResults);
      setResultCategory(searchCategory);
      setResultSuggestion(searchSuggestions);
      setShowResults(searchResults.length > 0);
    } catch (err) {
      setResultError("Failed to fetch search results.");
      setResults([]);
    } finally {
      setResultLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
    resultLoading,
    resultError,
    showResults,
    setShowResults,
    resultCategory,
    resultSuggestion,
  };
}
