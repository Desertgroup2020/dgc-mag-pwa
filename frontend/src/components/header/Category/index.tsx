"use client";

import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useRef, useState } from "react";
import categoryStyles from "../styles/categories.module.scss";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CategorySkeleton from "@/components/loader/CategorySkeleton";
import { debounce, throttle } from "@/lib/utils";
import MegamenuSkelton from "@/components/loader/MegamenuSkelton";

const DynamicNavIcon = dynamic(() => import("../../icons/NavIcon"));
const DynamicDropdownIcon = dynamic(
  () => import("../../icons/NavDropdownIcon")
);
const MenuDropDownContents = dynamic(() => import("./MenuDropDownContents"), {
  ssr: false,
});

const Categories = () => {
  const [dropOpen, setDropOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setDropOpen(true);
  };
  const onMouseLeave = (event: React.MouseEvent) => {
    timerRef.current = setTimeout(() => {
      setDropOpen(false);
    }, 200); // Delay to prevent blinking
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className={categoryStyles.category_section} >
      <div className="category_inner_wrapper">
        <Popover open={dropOpen}>
          <PopoverTrigger
            className="flex items-center"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <DynamicNavIcon className="gap-1" />
            <span className="category_title">Categories</span>
            <DynamicDropdownIcon />
          </PopoverTrigger>
          <PopoverContent
            ref={popoverRef}
            className="menu_popover"
            onInteractOutside={(e) => {
              setDropOpen(false);
            }}
          >
            <div className={`megamenu ${categoryStyles.megamenu}`}>
              <div className="container">
                <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                  <Suspense fallback={<MegamenuSkelton />}>
                    <MenuDropDownContents />
                    {/* <MegamenuSkelton /> */}
                  </Suspense>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Categories;
