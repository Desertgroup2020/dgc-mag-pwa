"use client";

import React from "react";
import categorySkeleton from "./styles/categoryskeleton.module.scss";
interface CategorySkeltopProps {
  noOfItems: number;
}
const CategorySkeleton = ({ noOfItems }: CategorySkeltopProps) => {
  const renderSkeletonItems = () => {
    return Array.from({ length: noOfItems }, (_, index) => (
      <div key={index} className="animate-pulse span_wrapper w-full"></div>
    ));
  };

  return (
    <div className={`category_skeleton ${categorySkeleton.category_skeleton}`}>
      {renderSkeletonItems()}
    </div>
  );
};
export default CategorySkeleton;
