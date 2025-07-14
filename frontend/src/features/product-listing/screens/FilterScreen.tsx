"use client";

import { Aggregation, AggregationOption, CategoryTree } from "@/generated/types";
import React from "react";
import PriceFilter from "../components/PriceFilter";
import { KeyValuePair } from "@/app/[...slug]/page";
import style from "../styles/filter.module.scss";
import ColorFilter from "../components/ColorFilter";
import BrandFilter from "../components/BrandFilter";
import CommonFilter from "../components/CommonFilter";
import { useFilterContext } from "../hooks/productFilterContext";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { Cross, CrossIcon, Plus, X } from "lucide-react";
import LayeredCategoryFilter from "../components/LayeredCategoryFilter";
import useCategory from "@/features/categories/hooks/useCategory";

type AggregationAttrCode =
  | "price"
  | "category_uid"
  | "brand"
  | "color"
  | "category_id";
interface FilterScreenProps {
  aggregations: Aggregation[];
  searchParams: KeyValuePair;
  onFilter?: () => void;
  cat_id: string
}

function FilterScreen({
  aggregations,
  searchParams,
  onFilter,
  cat_id
}: FilterScreenProps) {
  const filterContext = useFilterContext();  
  const isRouteChanging = useAppSelector((state) => state.window.routeChanging);  
  
  
  

  const screenSpliter = (aggregation: Aggregation, i: number) => {
    // console.log("aggrigation", aggregation.attribute_code);

    switch (aggregation.attribute_code as AggregationAttrCode) {
      case "price":
        return (
          <PriceFilter
            label={aggregation.label!}
            options={aggregation.options as AggregationOption[]}
            attrCode={aggregation.attribute_code}
            searchParams={searchParams}
            onFilter={onFilter}
          />
        );

      case "color":
        return (
          <ColorFilter
            label={aggregation.label!}
            options={aggregation.options as AggregationOption[]}
            attrCode={aggregation.attribute_code}
            searchParams={searchParams}
            onFilter={onFilter}
          />
        );
      case "brand":
        return (
          <BrandFilter
            label={aggregation.label!}
            options={aggregation.options as AggregationOption[]}
            attrCode={aggregation.attribute_code}
            searchParams={searchParams}
            onFilter={onFilter}
          />
        );

      case "category_id":
        return null;

      default:
        return (
          <CommonFilter
            label={aggregation.label!}
            options={aggregation.options as AggregationOption[]}
            attrCode={aggregation.attribute_code}
            searchParams={searchParams}
            onFilter={onFilter}
          />
        );
    }
  };

  return (
    <div className={`filter_screen ${style.filter_screen}`}>
      {Object.keys(filterContext?.filterState || {}).length &&
      !Object.keys(filterContext?.filterState || {}).some(
        (key) => key === "signin"
      ) &&
      !Object.keys(filterContext?.filterState || {}).some(
        (key) => key === "keyWord"
      ) ? (
        <Button
          variant={"action_green"}
          className="btn_action_green_rounded mb-3"
          onClick={filterContext?.clearAllFilter}
        >
          {/* <BtnRightArrow /> */}
          <span>Clear All</span>
        </Button>
      ) : null}
      {aggregations.map(screenSpliter)}
      <LayeredCategoryFilter cat_id={cat_id} />
    </div>
  );
}

export default FilterScreen;
