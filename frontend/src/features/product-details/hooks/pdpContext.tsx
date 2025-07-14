"use client";

import useProduct from "@/components/product/useProduct";
import RATING_INDICATOR, {
  GetRatingIndicatorsType,
} from "@/features/dynamic-url/apollo/queries/reviews/get_rating_indicator";
import {
  MediaGalleryInterface,
  ProductImage,
  ProductInterface,
  Rating,
} from "@/generated/types";
import { useErrorHandler } from "@/utils";
import { useQuery } from "@apollo/client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

// Define the types for your context state
export type MediaItem = {
  media_type: "video-file" | "image" | "video-url";
  thumbnail: string | null;
  media_file: string;
  media_url: string | null;
};

type PdpContextProps = {
  mediaList: MediaItem[];
  currentMedia: MediaItem | null;
  setCurrentMedia: Dispatch<SetStateAction<MediaItem | null>>;
  updateMediaList: ({
    mediaItems,
    variantId,
  }: {
    mediaItems: MediaItem[];
    variantId: string;
  }) => void;
  ratingIndicator: Rating;
  actualPrice: number;
  updatePrice: (price: number) => void;
  stockStatusLabel: "In Stock" | "Out of stock",
  setStockStatusLabel: Dispatch<SetStateAction<"In Stock" | "Out of stock">>
  productImage: ProductImage;
  currentProduct: ProductInterface
} | null;

// Create the context with a default value of null
const PdpContext = createContext<PdpContextProps>(null);

type PdpProviderProps = {
  children: ReactNode; // Use ReactNode to type children correctly
  product: ProductInterface;
};

// Create a provider component
const PdpContextProvider: React.FC<PdpProviderProps> = ({
  children,
  product,
}) => {
  // hooks
  const { productVideos, productImages, price, productImage } = useProduct({ product });
  const errorHandler = useErrorHandler();
  // data fetching if its intially needed
  const { data: ratingIndicatorResponse, loading } = useQuery<
    GetRatingIndicatorsType["Response"]
  >(RATING_INDICATOR, {
    onError: errorHandler,
  });
  // Initialize the state that you want to provide
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [calcPrice, setCalcPrice] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [stockStatusLabel, setStockStatusLabel] = useState<
    "In Stock" | "Out of stock"
  >("In Stock");

  // functionalities
  const defineMediaGroup = useCallback(() => {
    const refinedProductImages = productImages?.reduce(
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
    const refinedProductVideos = productVideos?.reduce(
      (acc: MediaItem[], video) => {
        return [
          ...acc,
          {
            media_type:
              video?.video_type === "file" ? "video-file" : "video-url",
            media_file:
              video?.video_type === "file"
                ? video?.video_file
                : video?.video_url,
            thumbnail: video?.thumbnail,
          },
        ] as MediaItem[];
      },
      [] as MediaItem[]
    );

    // Concatenate both image and video arrays
    const concatenatedMediaItems = [
      ...(refinedProductImages || []),
      ...(refinedProductVideos || []),
    ];

    setMediaList(concatenatedMediaItems);
  }, [productImages, productVideos]);

  const updateMediaList = ({
    mediaItems,
    variantId,
  }: {
    mediaItems: MediaItem[];
    variantId: string;
  }) => {
    // If the same variant is clicked again, don't do anything to avoid clearing the media list
    if (selectedVariant === variantId) return;

    // Set the new selected variant
    setSelectedVariant(variantId);

    // Replace the media list with the new items
    setMediaList(mediaItems);
  };
  const updatePrice = (price: number) => {
    if (price) {
      setCalcPrice(price);
    }
  };

  // side effects
  useEffect(() => {
    defineMediaGroup();
  }, [defineMediaGroup]);
  useEffect(() => {
    if (mediaList.length) setCurrentMedia(mediaList?.[0]);
  }, [mediaList]);
  useEffect(() => {
    if (price) {
      updatePrice(price);
    }
  }, [price]);
  useEffect(() => {
    if (product.stock_status) {
      if (product.stock_status === "IN_STOCK") {
        setStockStatusLabel("In Stock");
      } else {
        setStockStatusLabel("Out of stock");
      }
    }
  }, [product]);

  // Define the context value
  // console.log("media images from ctx", mediaList);

  const contextValue = {
    mediaList,
    currentMedia,
    setCurrentMedia,
    ratingIndicator: ratingIndicatorResponse?.amReviewSetting
      .ratings?.[0] as Rating,
    updateMediaList,
    updatePrice,
    actualPrice: calcPrice,
    stockStatusLabel,
    setStockStatusLabel,
    productImage: productImage as ProductImage,
    currentProduct: product
  };

  return (
    <PdpContext.Provider value={contextValue}>{children}</PdpContext.Provider>
  );
};

// Custom hook to use the PdpContext
const usePdpContext = () => {
  const context = useContext(PdpContext);
  if (!context) {
    throw new Error("usePdpContext must be used within a PdpContextProvider");
  }
  return context;
};

// Export the context, provider, and custom hook
export { PdpContext, usePdpContext };

export default PdpContextProvider;
