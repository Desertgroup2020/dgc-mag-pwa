"use client";

import {
  ConfigurableProduct,
  ConfigurableProductOptions,
  ProductInterface,
} from "@/generated/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  configReducer,
  ConfigStateValues,
  initialConfigState,
} from "./reducer";
import { MediaItem, usePdpContext } from "../../hooks/pdpContext";
import useProduct from "@/components/product/useProduct";

type ConfigurableContext = {
  isConfigurable: boolean;
  configurableOptions: ConfigurableProductOptions[] | null;
  configState: ConfigStateValues;
  updateBuyCount: (count: number) => void;
  updateConfigOptions: ({
    attribute_code,
    isMultiselect,
    value,
  }: {
    attribute_code: string;
    value: string;
    isMultiselect: boolean;
  }) => void;
} | null;
// Create the context with a default value of null
const configurableContext = createContext<ConfigurableContext>(null);

type PdpProviderProps = {
  children: ReactNode; // Use ReactNode to type children correctly
  product: ConfigurableProduct & { __typename: string };
};

// Create a provider component
const ConfigurableContextProvider: React.FC<PdpProviderProps> = ({
  children,
  product,
}) => {
  // hooks
  const { updateMediaList, updatePrice, setStockStatusLabel } = usePdpContext();
  const { price } = useProduct({ product });
  // constants
  const isConfigurable = useMemo(
    () => product.__typename === "ConfigurableProduct",
    [product]
  );
  const configurableOptions = useMemo(
    () => (product as ConfigurableProduct).configurable_options || null,
    [product]
  );

  // states
  const [state, dispatch] = useReducer(configReducer, initialConfigState);  

  // features
  const updateBuyCount = (count: number) => {
    dispatch({ type: "UPDATE_BUY_COUNT", payload: count });
  };

  const updateConfigOptions = ({
    attribute_code,
    isMultiselect,
    value,
  }: {
    attribute_code: string;
    value: string;
    isMultiselect: boolean;
  }) => {
    dispatch({
      type: "UPDATE_CONFIG_OPTIONS",
      attribute_code,
      value,
      isMultiselect,
    });
  };

  // effects
  useEffect(() => {
    const configOptions = product.configurable_options;

    if (configOptions?.length) {
      configOptions.map((configItem) => {
        if (configItem?.attribute_code && configItem.values?.[0]?.uid)
          updateConfigOptions({
            attribute_code: configItem.attribute_code,
            isMultiselect: false,
            value: configItem.values?.[0].uid,
          });
      });
    }
  }, [product]);

  useEffect(() => {
    const variants = product.variants;

    const currentVariant = variants?.find((variant) =>
      variant?.attributes?.every(
        (attrValue) =>
          attrValue?.uid === state.configurableOptions?.[attrValue?.code!]
      )
    );
    const currentMediaGallery = currentVariant?.product?.media_gallery;
    const selectedOptionPrice =
      currentVariant?.product?.price_range?.minimum_price?.final_price?.value;

    if (currentMediaGallery) {
      const configMediaItems = currentMediaGallery?.reduce(
        (acc: MediaItem[], image) => {
          return [
            ...acc,
            {
              media_type: "image",
              media_file: image?.url,
              thumbnail: image?.url,
            },
          ] as MediaItem[];
        },
        [] as MediaItem[]
      );
      if (configMediaItems.length)
        updateMediaList({
          mediaItems: configMediaItems,
          variantId: currentVariant.attributes?.[0]?.uid as string
        });
    }

    if (selectedOptionPrice) {
      updatePrice(selectedOptionPrice);
    }

    if (currentVariant?.product?.stock_status) {
      if (currentVariant?.product?.stock_status === "IN_STOCK") {
        setStockStatusLabel("In Stock");
      } else {
        setStockStatusLabel("Out of stock");
      }
    }
  }, [state.configurableOptions, product, setStockStatusLabel]);

  const contextValue = {
    isConfigurable,
    configState: state,
    updateBuyCount,
    updateConfigOptions,
    configurableOptions,
  } as ConfigurableContext;

  return (
    <configurableContext.Provider value={contextValue}>
      {children}
    </configurableContext.Provider>
  );
};

// Custom hook to use the PdpContext
const useConfigurableContext = () => {
  const context = useContext(configurableContext);
  if (!context) {
    throw new Error(
      "useconfigurableContext must be used within a configurableContextProvider"
    );
  }
  return context;
};

// Export the context, provider, and custom hook
export { configurableContext, useConfigurableContext };

export default ConfigurableContextProvider;
