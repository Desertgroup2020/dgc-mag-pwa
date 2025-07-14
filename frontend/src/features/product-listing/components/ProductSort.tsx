import { KeyValuePair } from "@/app/[...slug]/page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SortEnum, SortField, SortFields } from "@/generated/types";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFilterContext } from "../hooks/productFilterContext";
import { usePathname, useRouter } from "next/navigation";
import { queriesToLayeredFilter } from "@/features/dynamic-url/utils/utils";
import { deepEquals } from "@/lib/utils";
import { ArrowUpToLine, ChevronDown } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { updateRouteChanging } from "@/redux/window/windowSlice";

const DynamicDropdownIcon = dynamic(
  () => import("../../../components/icons/NavDropdownIcon")
);

interface ProductSortProps {
  sortFields: SortFields;
  searchParams: KeyValuePair;
}

type SortState = {
  sortMode: string;
  sortDir: SortEnum;
};

function ProductSort({ sortFields, searchParams }: ProductSortProps) {
  const [sortState, setSortState] = useState<SortState>({} as SortState);
  const [sortOpen, setSortOpen] = useState(false);
  const [currentSortDir, setCurrentSortDir] = useState<SortEnum>(SortEnum.Asc);
  const isInitialRender = useRef({});
  const pathname = usePathname();
  const router = useRouter();
  const filterContext = useFilterContext();
  const dispatch = useAppDispatch();

  const selectedSort = useMemo(
    () =>
      sortFields.options?.find((item) => item?.value === sortState?.sortMode),
    [sortFields, sortState]
  );

  useEffect(() => {
    const sortFromUrl = searchParams.sort;
    if (!!sortFromUrl) {
      const [name, by] = (sortFromUrl as string)?.split(":");
      setSortState({
        sortMode: name,
        sortDir: by as SortEnum,
      });
      isInitialRender.current = {
        sortMode: name,
        sortDir: by as SortEnum,
      };
      setCurrentSortDir(by as SortEnum);
    } else {
      setSortState({
        sortMode: "position",
        sortDir: SortEnum.Asc,
      });
      isInitialRender.current = {
        sortMode: "position",
        sortDir: SortEnum.Asc,
      };
    }
    // filterContext?.setFiltering(false);
  }, [searchParams]);

  const applySort = () => {
    const searchParamsWithSort = {
      ...searchParams,
      sort: `${sortState.sortMode}:${sortState.sortDir}`,
    };
    const urlStringFromState = queriesToLayeredFilter(searchParamsWithSort);

    router.push(`${pathname}?${urlStringFromState}`, { scroll: true });
    // router.prefetch(`${pathname}?${urlStringFromState}`)
  };

  const onSort = (sortItem: SortField) => {
    // filterContext?.setFiltering(true);
    dispatch(updateRouteChanging(true))
    setSortState((prev) => ({
      ...prev,
      sortMode: sortItem.value as string,
    }));
  };
  const onDirChange = () => {
    // filterContext?.setFiltering(true);
    dispatch(updateRouteChanging(true))
    setSortState((prev) => ({
      ...prev,
      sortDir: prev.sortDir === SortEnum.Asc ? SortEnum.Desc : SortEnum.Asc,
    }));
  };

  const hasChangeInSort = useMemo(
    () => !deepEquals(isInitialRender.current, sortState),
    [sortState]
  );
  useEffect(() => {
    // Run the effect when sortState changes after the initial render
    if (hasChangeInSort) applySort();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortState]);

  return (
    <div className="sort_dir">
      <Popover open={sortOpen}>
        <PopoverTrigger
          className="flex items-center"
          onClick={() => setSortOpen(true)}
        >
          <div className="sort_by">
            <span className="sort_title">Sort by: {selectedSort?.label || "Select"}</span>
            {/* <DynamicDropdownIcon fill="#D9D9D9" strokeWidth={4} width={} /> */}
            <ChevronDown stroke="#D9D9D9" width={20} />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="sort_popover"
          onInteractOutside={(e) => {
            setSortOpen(false);
          }}
        >
          <ul className="sort_opts">
            {sortFields.options
              ?.filter((item) => item?.value !== selectedSort?.value)
              ?.map((sortItem, i) => (
                <li key={i}>
                  <button onClick={() => {
                    onSort(sortItem as SortField);
                    setSortOpen(false);
                  }}>
                    {sortItem?.label}
                  </button>
                </li>
              ))}
          </ul>
        </PopoverContent>
      </Popover>
      <button
        className={`sort_dir ${currentSortDir === SortEnum.Desc ? "dec" : ""}`}
        onClick={onDirChange}
        aria-label="sort"
      >
        <ArrowUpToLine width={30} height={20} fill="#bd8a26" />
      </button>
    </div>
  );
}

export default ProductSort;
