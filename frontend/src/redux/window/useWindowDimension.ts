"use client"
import { useEffect, useState } from "react";
import { updateWindowDim } from "./windowSlice";
import { useAppDispatch } from "../hooks";
import { debounce } from "@/lib/utils";

const useWindowDimension = () => {
  const dispatch = useAppDispatch();
  const isSSR = typeof window === "undefined";
  const [windowSize, setWindowSize] = useState({
    width: isSSR ? 0 : window.innerWidth,
    height: isSSR ? 0 : window.innerHeight,
  });

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }

  useEffect(() => {    
    const handleResize = () => {
      dispatch(
        updateWindowDim({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      );
    };
    const debouncedResizeHandler = debounce(handleResize, 200);

    window.addEventListener("resize", debouncedResizeHandler);
    
    // Initial dispatch
    dispatch(
      updateWindowDim({
        width: isSSR ? window.innerWidth : 0,
        height: isSSR ? window.innerHeight : 0,
      })
    );

    return () => {
      window.removeEventListener("resize", debouncedResizeHandler);
    };
  }, [dispatch, isSSR]);

  return windowSize;
};

export default useWindowDimension;
