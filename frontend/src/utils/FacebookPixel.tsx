"use client";

import { StoreConfig } from "@/generated/types";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import ReactPixel from "react-facebook-pixel";

export interface ExtendedStoreConfig extends StoreConfig {
  facebook_pixel: {
    id: string;
    enabled: boolean;
  };
}
function FacebookPixel() {
  const storeConfig = useAppSelector(
    (state) => state.storeConfig.data?.storeConfig
  ) as ExtendedStoreConfig;

  useEffect(() => {
    if (
      !!storeConfig?.facebook_pixel?.id &&
      storeConfig.facebook_pixel.enabled
    ) {
      // console.log("got the id", storeConfig?.facebook_pixel.id);

      ReactPixel.init(storeConfig?.facebook_pixel.id);
    }
  }, [storeConfig]);

  return null;
}

export default FacebookPixel;
