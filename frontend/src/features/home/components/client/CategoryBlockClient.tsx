"use client";

import React, { useCallback, useMemo } from "react";
import { CategoryBlock } from "@/generated/types";
import Image from "next/image";
import categoryBlockStyles from "../../styles/categoryblock.module.scss";
import Link from "next/link";

interface CategoryBlockClientProp {
  categoryBlock: CategoryBlock;
}

function CategoryBlockClient({ categoryBlock }: CategoryBlockClientProp) {
  // console.log("categoryblock", categoryBlock);
  const categoryItems = useMemo(
    () => categoryBlock.category_info
    // ?.filter((item, i)=>i < 5)
    ,
    [categoryBlock]
  );
  const categoryItemLength = categoryItems?.length;
  const classSwitcher = useCallback(() => {
    switch (categoryItems?.length) {
      case 1:
        return "items_1";
      case 2:
        return "items_2";
      case 3:
        return "items_3";
      case 4:
        return "items_4";
      case 5:
        return "items_5";
      case 6:
        return "items_6";
      default:
        break;
    }
  }, [categoryItems]);

  return (
    <>
      <div className={`grid ${classSwitcher()}`}>
        {categoryItems?.map((catItem, i) => (
          <Link
            href={`${catItem?.url_key}.html`}
            className={`category_card ${categoryBlockStyles.category_card}`}
            key={catItem?.category_id}
          >
            <h3 className=" text-cat_font text-white">
              <span>{catItem?.name}</span>
            </h3>
            <Image
              src={catItem?.image || ""}
              alt="category image"
              width={496}
              height={482}
              className=" h-full w-full object-cover"
            />
          </Link>
        ))}
      </div>     
    </>
  );
}

export default CategoryBlockClient;
