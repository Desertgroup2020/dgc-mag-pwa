"use client";

import useProduct from "@/components/product/useProduct";
import {
  BundleItem,
  BundleOptionInput,
  BundleProduct,
} from "@/generated/types";
import { FormikProps, useFormik } from "formik";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import * as Yup from "yup";
import bundleReducer, { BundleAction, BundleState } from "./reducer";
import { usePdpContext } from "@/features/product-details/hooks/pdpContext";
import useCart from "@/features/cart/hooks/useCart";

type BundleOption = {
  id: number;
  quantity: number;
  value: string[];
};
export type BundleSelectionError = {
  bundleItemId: string;
  error: string;
}
export type BundleSelectionErrortype = BundleSelectionError[];

type BundleContextPropretiesType = {
  isBundleProduct: boolean;
  bundleItems: BundleItem[] | null;
  bundleTrackstate: BundleState;
  dispatch: React.Dispatch<BundleAction>;
  grandPermissionForAddToCart: Promise<{
    bundle_options: {
      id: number;
      quantity: number;
      value: string[];
    }[];
  }>;
} | null;

const bundleContext = createContext<BundleContextPropretiesType>(null);

type BundleContextProviderType = {
  children: ReactNode;
  product: BundleProduct & { __typename: string };
};
const BundleContextProvider = ({
  children,
  product,
}: BundleContextProviderType) => {
  const { updatePrice } = usePdpContext();
  const { handleBundleAddToCart } = useCart();
  // constants
  const isBundleProduct = useMemo(
    () => product.__typename === "BundleProduct",
    [product]
  );
  const bundleItems = useMemo(() => product.items, [product]);

  // states
  const [bundleTrackstate, dispatch] = useReducer(bundleReducer, {});
  // hooks
  const { price } = useProduct({ product });

  // features
  const calculatedPrice = useMemo(() => {
    let total = price || 0; // Start with the base product price

    Object.entries(bundleTrackstate).forEach(([bundleItemId, selection]) => {
      const item = bundleItems?.find(
        (item) => item?.option_id?.toString() === bundleItemId
      );
      if (!item) return;

      selection.values.forEach((selectedOptionId) => {
        const selectedOption = item.options?.find(
          (option) => option?.id?.toString() === selectedOptionId
        );
        if (
          selectedOption?.product?.price_range?.minimum_price?.final_price.value
        ) {
          total +=
            selectedOption?.product?.price_range?.minimum_price?.final_price
              .value;
        }
      });
    });

    updatePrice(total);
    return total;
  }, [bundleTrackstate, bundleItems, price]);

  const checkTheBundleSelection = useCallback<
    () => { bundle_options: BundleOptionInput[] } | BundleSelectionErrortype
  >(() => {
    let errors: BundleSelectionErrortype = [];
    let bundleOptions: BundleOptionInput[] = [];

    const requiredItems = bundleItems?.filter((item) => item?.required);
    console.log("requiredItems", requiredItems);
    console.log("bundleTrackstate", bundleTrackstate);

    Object.entries(bundleTrackstate).forEach(([key, value]) => {
      const matchingItem = bundleItems?.find(
        (item) => item?.option_id?.toString() === key && value.values.length
      );

      if (
        !matchingItem &&
        requiredItems?.some((item) => item?.option_id?.toString() === key)
      ) {
        errors.push({
          bundleItemId: key,
          error: "Please select one of those",
        });
      } else if (matchingItem?.option_id && value.values.length) {
        bundleOptions.push({
          id: matchingItem.option_id,
          quantity: 1,
          value: value.values,
        });
      }
    });

    if (errors.length) {
      return errors;
    }

    return { bundle_options: bundleOptions };
  }, [bundleItems, bundleTrackstate]);

  const checkTheBundleSelectionAsync = async (): Promise<
    { bundle_options: BundleOptionInput[] } | BundleSelectionErrortype
  > => {
    let result = checkTheBundleSelection();

    // Simulating an async check (e.g., backend validation)
    await new Promise((res) => setTimeout(res, 500));

    return result;
  };
  const grandPermissionForAddToCart = checkTheBundleSelectionAsync().then(
    (result) => {
      if ("bundle_options" in result) {
        return result; // Return the structured data for mutation
      } else {
        throw result; // Reject with errors
      }
    }
  );

  // effects
  useEffect(() => {
    if (!bundleItems) return;

    bundleItems.forEach((item) => {
      if (item?.required && item?.options?.length) {
        dispatch({
          type:
            item.type === "radio" || "select"
              ? "UPDATE_RADIO"
              : "UPDATE_CHECKBOX",
          bundleItemId: item.option_id?.toString() || "",
          value: item?.options[0]?.id?.toString() || "", // Select the first option
          qty: 1,
        });
      }
    });
  }, [bundleItems]);

  

  console.log("calculated price", calculatedPrice);

  const contextValue = {
    isBundleProduct,
    bundleItems,
    bundleTrackstate,
    dispatch,
    grandPermissionForAddToCart,
  } as BundleContextPropretiesType;

  return (
    <bundleContext.Provider value={contextValue}>
      {children}
    </bundleContext.Provider>
  );
};

export const useBundleContext = () => {
  const context = useContext(bundleContext);
  if (!context) {
    throw new Error(
      "usebundleContext must be used within a BundleContextProvider"
    );
  }
  return context;
};

export default BundleContextProvider;
