import { KeyValuePair } from "@/app/[...slug]/page";
import logger from "@/lib/logger";
import PRODUCTS, { ProductsQuery } from "../apollo/queries/productPlp";
import {
  FilterEqualTypeInput,
  FilterMatchTypeInput,
  FilterRangeTypeInput,
  ProductAttributeFilterInput,
} from "@/generated/types";
import { getClient } from "@/lib/apollo/client";

export const MIN_PRODUCTS_PER_PAGE = 12;
export const FIRST_PAGE = 1;

export type QueryType = { [key: string]: string | string[] };

export type FilterArgsType =
  | "FilterTypeInput"
  | "FilterEqualTypeInput"
  | "FilterMatchTypeInput"
  | "FilterRangeTypeInput";

export const filterArgs: { [key: string]: FilterArgsType } = {
  brand: "FilterEqualTypeInput",
  category_id: "FilterEqualTypeInput",
  category_uid: "FilterEqualTypeInput",
  category_url_path: "FilterEqualTypeInput",
  created_at: "FilterTypeInput",
  description: "FilterMatchTypeInput",
  name: "FilterMatchTypeInput",
  news_from_date: "FilterTypeInput",
  news_to_date: "FilterTypeInput",
  price: "FilterRangeTypeInput",
  short_description: "FilterMatchTypeInput",
  size: "FilterEqualTypeInput",
  sku: "FilterEqualTypeInput",
  url_key: "FilterEqualTypeInput",
  color: "FilterEqualTypeInput"
};

export function deleteQuries(query: KeyValuePair, keys: string[]) {
  // eslint-disable-next-line no-param-reassign
  keys.forEach((key) => delete query[key]);
}

export function getValueRelatedToType(type: FilterArgsType, value: string) {
  let parsedValue: any = value;
  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    // do nothing
  }
  const valueIsArray = Array.isArray(parsedValue);
  switch (type) {
    case "FilterEqualTypeInput": {
      const structure: FilterEqualTypeInput = {
        eq: valueIsArray ? undefined : (parsedValue as string),
        in: valueIsArray ? (parsedValue as string[]) : undefined,
      };
      return structure;
    }
    case "FilterMatchTypeInput": {
      const structure: FilterMatchTypeInput = {
        match: valueIsArray ? parsedValue[0] : parsedValue,
      };
      return structure;
    }
    case "FilterRangeTypeInput": {
      const [from, to] = parsedValue.split("_");
      const structure: FilterRangeTypeInput = {
        from,
        to,
      };
      return structure;
    }
    default:
      return undefined;
  }
}

function getPageDetails(queries: KeyValuePair) {
  const page = Number(queries.page as string) || FIRST_PAGE;
  const limit = Number(queries.limit as string) || MIN_PRODUCTS_PER_PAGE;

  deleteQuries(queries, ["page", "limit"]);

  return {
    currentPage: page,
    pageSize: limit,
  };
}

export function getSearch(queries: KeyValuePair) {
  const search = queries.keyWord as string;
  // deleteQuries(queries, ["keyWord"]);
  return search;
}

export function getFilters(queries: KeyValuePair) {
  const queryArray = Object.entries(queries);
  const filters: ProductAttributeFilterInput = {} as any;
  queryArray.forEach(([key, value]) => {
    const filterType = filterArgs[key as keyof typeof filterArgs];
    if (filterType) {
      filters[key as keyof ProductAttributeFilterInput] = getValueRelatedToType(
        filterType,
        value as string
      );
    }
  });

  // console.log("filters", filters);
  

  return filters;
}

export function getSort(queries: KeyValuePair) {
  const sort = queries.sort as string;
  // console.log("sort", sort);

  const [name, by] = sort?.split(":") || [];
  // deleteQuries(queries, ["sort"]);
  if (name && by) {
    return { [name]: by };
  }
  return undefined;
}

export function queriesToVariables(
  queries: KeyValuePair
): ProductsQuery["Variables"] {
  return {
    ...getPageDetails(queries),
    search: getSearch(queries),
    filter: getFilters(queries),
    sort: getSort(queries),
  };
}

// export async function getProducts(queries: KeyValuePair) {
//   try {
//     const variables = queriesToVariables(queries);

//     const response = await getClient().query<
//       ProductsQuery["Response"],
//       ProductsQuery["Variables"]
//     >({
//       query: PRODUCTS,
//       variables,
//     });

//     return response.data.products;
//   } catch (err) {
//     logger.error(err);
//     throw err;
//   }
// }

export const queriesToLayeredFilter = (obj: Record<string, any>): string => {
  const entries = Object.entries(obj);
  let query = "";
  entries.forEach(([key, value], i, arr) => {
    query += `${key}=${value}${arr.length - 1 === i ? "" : "&"}`;
  });
  return query;
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
) => {
  let timer: NodeJS.Timeout;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as F;
};
