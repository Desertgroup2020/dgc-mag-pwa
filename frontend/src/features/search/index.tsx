"use client";

import React, { useRef, useEffect } from "react";
import searchStyles from "./styles/search.module.scss";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { updateRouteChanging } from "@/redux/window/windowSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CategorySkeleton from "@/components/loader/CategorySkeleton";
import useSearch from "./hooks/useSearch";
import Image from "next/image";
import Link from "next/link";

interface HighlightField {
  matched_tokens: string[];
  snippet: string;
  value: string;
}

interface SearchResult {
  document: {
    id?: string;
    uid?: string;
    name?: string;
    image_url?: string;
    url_key?: string;
    price?: number;
    category?: string[];
  };
  highlight?: {
    name?: HighlightField;
    description?: HighlightField;
    category?: HighlightField;
  };
}

const SearchLinkMaker: React.FC<{ result: SearchResult }> = ({ result }) => {
  const { document } = result;
  //const categories = document.category || [];
  const highlightedName = result.highlight?.name?.value || document.name;

  return (
    <Link href={`${document.url_key ? document.url_key + ".html" : "#"}`}>
      <div className="search_item">
        <div className="name_image">
          <Image
            src={document?.image_url || ""}
            alt={document?.name || ""}
            width={60}
            height={40}
            unoptimized
          />
          <span dangerouslySetInnerHTML={{ __html: highlightedName || "" }} />
        </div>
        <div className="price_cat">
          <div className="price">
            {document?.price ? (
              <>
                <span>AED</span>
                <span>{document.price}</span>
              </>
            ) : (
              "N/A"
            )}
          </div>
          {/* <div className="cats">
            {categories.length > 0 ? (
              <span>{categories.map((cat) => cat).join(", ")}</span>
            ) : null}
          </div> */}
        </div>
      </div>
    </Link>
  );
};

const Search = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    query,
    setQuery,
    results,
    resultLoading,
    showResults,
    setShowResults,
    resultCategory,
    resultSuggestion,
  } = useSearch();

  //console.log("resultCategory", resultCategory);
  //console.log("resultSuggestion", resultSuggestion);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateRouteChanging(true));
    router.push(`/search?keyWord=${query}`);
    setQuery("");
  };

  return (
    <div className={searchStyles.search_section} ref={searchContainerRef}>
      <Popover open={showResults}>
        <PopoverTrigger className="flex items-center" asChild>
          <div
            role="combobox"
            aria-expanded={showResults}
            aria-controls="search-results"
          >
            <form onSubmit={onSubmitSearch} autoComplete="off">
              <div className="search_input_wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  name="keyWord"
                  className="input_field"
                  placeholder="What are you Looking for?"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                    // Refocus input to prevent losing focus
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-controls="search-results"
                />
                <button
                  type="submit"
                  className="search_button"
                  disabled={!query || resultLoading}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="search_popover"
          id="search-results"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className={`searchResultScreen ${searchStyles.searchStyles}`}>
            {!resultLoading ? (
              results?.length ||
              resultCategory?.length ||
              resultSuggestion?.length ? (
                <>
                  <div className="flex mobile:flex-col-reverse">
                    <div className="p-2 search_sidebar">
                      {resultSuggestion?.length ? (
                        <div>
                          <h2 className="text-cat_font text-black pb-1">
                            Suggestions
                          </h2>
                          <ul className="mb-2 search_lists">
                            {resultSuggestion?.map((suggestions, i) => (
                              <li key={i}>
                                <Link
                                  href={`/search?keyWord=${suggestions.document.q}`}
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      suggestions.highlight?.q?.snippet || "",
                                  }}
                                  className="cursor-pointer"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    router.push(
                                      `/search?keyWord=${suggestions.document.q}`
                                    );
                                    setQuery("");
                                  }}
                                ></Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {resultCategory?.length ? (
                        <div>
                          <h2 className="text-cat_font text-black pb-1">
                            Categories
                          </h2>
                          <ul className="search_lists">
                            {resultCategory?.map((catgories, i) => (
                              <li key={i}>
                                <Link
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      catgories.highlight?.name?.snippet || "",
                                  }}
                                  href={`/${
                                    catgories.document.path
                                      ? catgories.document.path
                                          .toLowerCase()
                                          .replace(/\s*\/\s*/g, "/")
                                          .replace(/\s+/g, "-")
                                          .replace(/&/g, "-")
                                          .replace(/-+/g, "-")
                                      : "#"
                                  }.html`}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    router.push(
                                      `/${catgories.document.path
                                        ?.toLowerCase()
                                        .replace(/\s*\/\s*/g, "/")
                                        .replace(/\s+/g, "-")
                                        .replace(/&/g, "-")
                                        .replace(/-+/g, "-")}.html`
                                    );
                                    setQuery("");
                                  }}
                                ></Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                    <ul className="result_list">
                      {results.map((item) => (
                        <li key={item?.document?.id || item?.document?.uid}>
                          <SearchLinkMaker result={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-center items-center py-2">
                    <p
                      className="cursor-pointer underline"
                      onClick={(e) => onSubmitSearch(e)}
                    >
                      View All
                    </p>
                  </div>
                </>
              ) : (
                <p className="no_product_found text-h3 font-600">
                  No Results Found!
                </p>
              )
            ) : (
              <div className="loader">
                <CategorySkeleton noOfItems={5} />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Search;
