"use client";

import CategorySkeleton from "@/components/loader/CategorySkeleton";
import categoryStyles from "../styles/categories.module.scss";
import { Button } from "@/components/ui/button";
import {
  CATEGORY,
  CategoryQuery,
} from "@/features/categories/apollo/query/category";
import { CategoryTree } from "@/generated/types";
import { useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import Masonry from "masonry-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Minus, Plus } from "lucide-react";
import MegamenuSkelton from "@/components/loader/MegamenuSkelton";

interface MenuItemProps {
  menuItem: CategoryTree;
  pathname: string;
  msnry: Masonry | null;
  isTierOne?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  menuItem,
  isTierOne,
  pathname,
  msnry,
}) => {
  // console.log("pathname", pathname);

  const linkActive = pathname === `${menuItem.url_path}${menuItem.url_suffix}`;

  // states
  const [submenuOpen, setSubmenuOpen] = useState<"submenu_acc" | "close">(
    "close"
  );

  // effects

  useLayoutEffect(() => {
    if (msnry) {
      setTimeout(() => {
        msnry.reloadItems?.();
        msnry.layout?.();
      }, 100);
    }
  }, [submenuOpen, msnry]);

  if (!menuItem.include_in_menu) return null;

  return (
    <li key={menuItem.uid} className={`${isTierOne ? "item" : ""}`}>
      {menuItem.children && menuItem.children.length > 0 && !isTierOne ? (
        <Accordion
          type="single"
          collapsible
          className="submenu_acc"
          value={submenuOpen}
        >
          <AccordionItem value="submenu_acc" className="acc_item">
            <AccordionTrigger className="heading">
              <Link href={`/${menuItem?.url_path}${menuItem?.url_suffix}`}>
                {menuItem.name}
              </Link>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setSubmenuOpen((prev) =>
                    prev === "submenu_acc" ? "close" : "submenu_acc"
                  );
                }}
              >
                {submenuOpen === "submenu_acc" ? (
                  <Minus className="icon" size={20} />
                ) : (
                  <Plus className="icon" size={20} />
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="acc_content">
              <ul className={`drop_down `}>
                {menuItem.children.map((node) => (
                  <div key={node?.uid} className="flex items-start gap-1">
                    <span>-</span>
                    <MenuItem
                      menuItem={node as CategoryTree}
                      pathname={pathname}
                      msnry={msnry}
                    />
                  </div>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <>
          <Link
            href={`/${menuItem?.url_path}${menuItem?.url_suffix}`}
            className={`link_item ${linkActive ? "active" : ""} ${
              menuItem.children?.length ? "haschild" : ""
            }`}
          >
            <span>{menuItem.name}</span>
          </Link>
          {menuItem.children && menuItem.children.length > 0 && (
            <ul className={`drop_down `}>
              {menuItem.children.map((node) => (
                <MenuItem
                  key={node?.uid}
                  menuItem={node as CategoryTree}
                  pathname={pathname}
                  msnry={msnry}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
};

function MenuDropDownContents() {
  const pathname = usePathname();
  const { data, loading, error } = useQuery<
    CategoryQuery["Response"],
    CategoryQuery["Variables"]
  >(CATEGORY);
  const masonryRef = useRef<HTMLUListElement | null>(null);

  // constants
  const commonImage = useMemo(() => data?.categories.megamenuImageInfo, [data]);

  // states
  const [msnryObj, setMsnryObj] = useState<Masonry | null>(null);

  const sortedChildren = useMemo(() => {
    return data?.categories.items?.[0]?.children
      ? [...data.categories.items[0].children].sort((a, b) => {
          const aChildrenLength = a?.children?.length ?? 0;
          const bChildrenLength = b?.children?.length ?? 0;

          if (aChildrenLength === 0 && bChildrenLength !== 0) {
            return 1; // a should come after b
          } else if (aChildrenLength !== 0 && bChildrenLength === 0) {
            return -1; // a should come before b
          } else {
            return 0; // keep the same order for other cases
          }
        })
      : [];
  }, [data?.categories.items]);

  // effetcs
  useEffect(() => {
    // console.log("is this repeating..");

    if (masonryRef.current) {
      // Initialize Masonry after the component mounts and after items have been rendered
      const msnry = new Masonry(masonryRef.current, {
        itemSelector: ".item", // Class for items
        columnWidth: ".item", // Can be any width setting
        horizontalOrder: true,
        percentPosition: true,
        // gutter: 10, // Adjust the gap between items
      });

      setMsnryObj(msnry);
      // Cleanup function to destroy Masonry instance on unmount
      return () => {
        msnry.destroy;
        setMsnryObj(null);
      };
    }
  }, [sortedChildren]);

  if (loading) {
    return <MegamenuSkelton />;
  }
  // console.log("category items", data?.categories.items);
  console.log("commonImage", commonImage);

  return (
    <div className={`megamenu ${categoryStyles.megamenu}`}>
      <div className="container">
        <div className="menu_wraper">
          <div className="divider">
            <div className="left">
              <div className="menu_list_wrap">
                <ul className="lists" ref={masonryRef}>
                  {sortedChildren?.map((node, i) => (
                    <MenuItem
                      key={node?.uid}
                      menuItem={node as CategoryTree}
                      pathname={pathname}
                      isTierOne
                      msnry={msnryObj}
                    />
                  ))}
                </ul>
              </div>
            </div>
            <div className="right">
              <figure className="common_img">
                <Link href={`${commonImage?.url}`}>
                  <Image
                    src={`${commonImage?.image}`}
                    alt="Category Image"
                    width={320}
                    height={460}
                  />
                </Link>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuDropDownContents;
