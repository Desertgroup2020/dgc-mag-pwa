"use client";

import PageLoader from "@/components/header/components/PageLoader";
import SiteSheet from "@/components/reusable-uis/SiteSheet";
import React, { useEffect, useState } from "react";
// import FilterScreen from "../screens/FilterScreen";
import { Aggregation } from "@/generated/types";
import { KeyValuePair } from "@/app/[...slug]/page";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { SlidersHorizontal } from "lucide-react";
import { useFilterContext } from "../hooks/productFilterContext";

const FilterScreen = dynamic(() => import("../screens/FilterScreen"), {
  ssr: false,
  loading(loadingProps) {
    return <span>Filter loading...</span>;
  },
});

interface MobileFilterIntiatorProps {
  aggregations: Aggregation[];
  searchParams: KeyValuePair;
  cat_id: string;
}
function MobileFilterIntiator({
  aggregations,
  searchParams,
  cat_id
}: MobileFilterIntiatorProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const filterCtx = useFilterContext();
  const onOpenChange = () => {
    setSheetOpen((prev) => !prev);
  };

  useEffect(() => {
    const filterState = filterCtx?.filterState;
    if (filterState && Object.keys(filterState).length) {
      if (sheetOpen) setSheetOpen(false);
    }
  }, [filterCtx?.filterState]);

  return (
    <div className="mobile_filter">
      <Button onClick={onOpenChange} variant={"itself"} className="text-h2">
        <SlidersHorizontal stroke="#494949" strokeWidth={2} />
      </Button>
      <SiteSheet
        opts={{ open: sheetOpen, onOpenChange: onOpenChange }}
        position="left"
        className={"filter_sheet"}
      >
        <PageLoader />
        <FilterScreen
          aggregations={aggregations}
          searchParams={searchParams}
          onFilter={onOpenChange}
          cat_id={cat_id}
        />
      </SiteSheet>
    </div>
  );
}

export default MobileFilterIntiator;
