"use client";

import { Breadcrumb } from "@/generated/types";
import Link from "next/link";
import React, { useMemo } from "react";
import style from "./style.module.scss";
import { useAppSelector } from "@/redux/hooks";
import { trimFirstSentence } from "@/lib/utils";

interface BreadCrumbsProps {
  breadcrumbs: Breadcrumb[] | [];
  currentItem: Breadcrumb & { havingSuffix: boolean };
}

function BreadCrumbs({ breadcrumbs, currentItem }: BreadCrumbsProps) {
  // console.log("breadcrumbs", breadcrumbs);
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  const alteredBreadCrumbs = [...breadcrumbs];

  // Add an item at the beginning of the array
  alteredBreadCrumbs.splice(0, 0, {
    category_uid: "",
    category_name: "Home",
    category_url_path: "",
  });

  // Add an item at the end of the array
  alteredBreadCrumbs.splice(alteredBreadCrumbs.length, 0, {
    category_uid: currentItem.category_uid || "",
    category_name: currentItem.category_name,
    category_url_path: currentItem.category_url_path,
  });

  const havingSuffix = useMemo(() => currentItem.havingSuffix, [currentItem]);

  return (
    <ul className={`bread_crumbs ${style.bread_crumbs}`}>
      {alteredBreadCrumbs.map((crumb, i) => (
        <li
          key={i}
          className={i === alteredBreadCrumbs.length - 1 ? "active" : ""}
        >
          {i === alteredBreadCrumbs.length - 1 ? (
            <span className="crumb_link">
              {winWidth && winWidth > 767
                ? crumb.category_name
                : trimFirstSentence(crumb.category_name as string)}
            </span>
          ) : (
            <Link
              href={`/${crumb.category_url_path}${
                havingSuffix && i !== 0 ? ".html" : ""
              }`}
              className="crumb_link"
            >
              <span>
                {winWidth && winWidth > 767
                  ? crumb.category_name
                  : trimFirstSentence(crumb.category_name as string)}
              </span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export default BreadCrumbs;
