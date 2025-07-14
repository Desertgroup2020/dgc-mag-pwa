"use client";

import React, {
  useCallback,
  useLayoutEffect,
} from "react";
import { updateWindowDim } from "./windowSlice";
import { useAppDispatch } from "../hooks";
import { debounce, throttle } from "@/lib/utils";


function WindowDimension() {
  const dispatch = useAppDispatch();
  const isClient = typeof window !== "undefined";
  
  const handleResize = useCallback(() => {
    dispatch(
      updateWindowDim({
        width: (isClient && window.innerWidth) || 0,
        height: (isClient && window.innerHeight) || 0,
      })
    );
  }, [dispatch, isClient]);

  useLayoutEffect(() => {
    const debouncedResizeHandler = throttle(handleResize, 500);
    window.addEventListener("resize", debouncedResizeHandler);

    // Initial dispatch
    dispatch(
      updateWindowDim({
        width: (isClient && window.innerWidth) || 0,
        height: (isClient && window.innerHeight) || 0,
      })
    );

    return () => {
      window.removeEventListener("resize", debouncedResizeHandler);
    };
  }, [dispatch, handleResize, isClient]);

  return null;
}

export default WindowDimension;
