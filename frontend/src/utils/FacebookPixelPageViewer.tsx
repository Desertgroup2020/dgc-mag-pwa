"use client";

import React, { useEffect } from "react";
import ReactPixel from "react-facebook-pixel";
import { ExtendedStoreConfig } from "./FacebookPixel";
import { useAppSelector } from "@/redux/hooks";

function FacebookPixelPageViewer() {
  const storeConfig = useAppSelector(
    (state) => state.storeConfig.data?.storeConfig
  ) as ExtendedStoreConfig;

  useEffect(() => {
    if (!!storeConfig?.facebook_pixel.id) ReactPixel.pageView();
  }, [storeConfig]);

  return null;
}

export default FacebookPixelPageViewer;
