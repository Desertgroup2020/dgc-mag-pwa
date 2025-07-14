"use client";

import { KeyValuePair } from "@/app/[...slug]/page";
import { queriesToLayeredFilter } from "@/features/dynamic-url/utils/utils";
import { deepEquals } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectWindowDim,
  updateRouteChanging,
} from "@/redux/window/windowSlice";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { useSelector } from "react-redux";

export type FilterUpdateArgs = {
  key: string;
  value: string;
};
export type FilterDeleteArgs = {
  key: string;
};

export type FilterAction =
  | { type: "UPDATE"; payload: FilterUpdateArgs }
  | { type: "REMOVE" }
  | { type: "UPDATE_URL"; payload: KeyValuePair }
  | { type: "DELETE"; payload: FilterDeleteArgs };

export type ContextControllerType = {
  filterState: KeyValuePair;
  updateFilter: (key: string, value: string) => void;
  deleteFilter: (key: string) => void;
  applyFilter: () => void;
  clearAllFilter: () => void;
} | null;

const initialState: KeyValuePair = {};
const filterReducer = (
  state: KeyValuePair,
  action: FilterAction
): KeyValuePair => {
  switch (action.type) {
    case "UPDATE":
      // console.log("update call");

      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case "DELETE":
      // console.log("delete call");

      const newState = { ...state };
      delete newState[action.payload.key];
      return newState;

    case "REMOVE":
      // console.log("REMOVE call");
      return {};

    case "UPDATE_URL":
      // console.log("UPDATE_URL call");
      // delete action.payload.price
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

export const FilterStateContext = createContext<ContextControllerType>(null);

const FilterStateProvider = ({
  children,
  searchParams,
  pathName,
}: {
  children: React.ReactNode;
  searchParams: KeyValuePair;
  pathName: string;
}) => {
  const router = useRouter();
  // const pathName = usePathname();
  const filterStateChangeRef = useRef<KeyValuePair>({});
  const dispatch = useAppDispatch();
  const { width } = useSelector(selectWindowDim);
  const isDesk = useMemo(() => width > 991, [width]);
  const [filterState, dispatchFilterState] = useReducer(
    filterReducer,
    initialState
  );
  const basePath =
    typeof window === undefined
      ? process.env.NEXT_PUBLIC_PRODUCTION_URL
      : process.env.NEXT_PUBLIC_DEVELOPMENT_URL;

  const updateFilter = (key: string, value: string) => {
    dispatchFilterState({ type: "UPDATE", payload: { key, value } });
    dispatch(updateRouteChanging(true));
  };

  const deleteFilter = (key: string) => {
    dispatchFilterState({ type: "DELETE", payload: { key } });
    dispatch(updateRouteChanging(true));
  };

  const applyFilter = useCallback(() => {
    const query = queriesToLayeredFilter(filterState);
    // console.log("query for url", query);

    router.push(`${pathName}${!!query ? `?${query}` : ""}`);
  }, [filterState, pathName, router]);

  const clearAllFilter = useCallback(()=>{
    dispatchFilterState({type: "REMOVE"});
  }, [])

  useEffect(() => {
    dispatchFilterState({
      type: "UPDATE_URL",
      payload: searchParams as KeyValuePair,
    });
    filterStateChangeRef.current = searchParams;
  }, [searchParams]);

  const hasChangeInLayeredFilterData = useMemo(
    // remember need to change {}
    () => !deepEquals(filterStateChangeRef.current, filterState),
    [filterState]
  );

  useEffect(() => {
    const query = queriesToLayeredFilter(filterState);

    if (hasChangeInLayeredFilterData) {
      router.push(`/${pathName}${!!query ? `?${query}` : ""}`, { scroll: true });
      dispatch(updateRouteChanging(true));
    }
  }, [filterState, router]);

  const handlers = {
    filterState,
    updateFilter,
    deleteFilter,
    applyFilter,
    clearAllFilter
  };

  return (
    <FilterStateContext.Provider value={handlers}>
      {children}
    </FilterStateContext.Provider>
  );
};

export const useFilterContext = () =>
  useContext<ContextControllerType>(FilterStateContext);

export default FilterStateProvider