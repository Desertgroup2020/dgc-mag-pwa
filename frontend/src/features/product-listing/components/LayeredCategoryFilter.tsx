import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CATEGORY,
  CategoryQuery,
} from "@/features/categories/apollo/query/category";
import { CategoryTree } from "@/generated/types";
import { useQuery } from "@apollo/client";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "../styles/filter.module.scss";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ContextControllerType,
  FilterStateContext,
} from "../hooks/productFilterContext";
import useCategory from "@/features/categories/hooks/useCategory";
import { hasDeepChildren } from "@/lib/utils";
import { DefaultProps, KeyValuePair } from "@/app/[...slug]/page";
import CategorySkeleton from "@/components/loader/CategorySkeleton";

interface MenuItemProps {
  menuItem: CategoryTree;
  pathname: string;
  cat_id: string;
  selectedPath: string[]; // Pass the selected path
  isTierOne?: boolean;
  accordionState: Record<string, boolean> | null;
  setAccordionState: Dispatch<SetStateAction<Record<string, boolean> | null>>;
}
const MenuItem: React.FC<MenuItemProps> = ({
  menuItem,
  isTierOne,
  pathname,
  selectedPath,
  cat_id,
  accordionState,
  setAccordionState,
}) => {
  const linkActive = pathname === `${menuItem.url_path}${menuItem.url_suffix}`;
  const catId = cat_id;
  const router = useRouter();

  // Check if the current menu item or its descendants are in the selected path
  const isInPath = selectedPath.includes(menuItem.id?.toString() || "");

  // effects
  useEffect(() => {
    // console.log("isInPath:", isInPath, "menuItem.id:", menuItem.id);
    if (isInPath) {
      setAccordionState((prev) => ({
        ...(prev as Record<string, boolean>),
        [menuItem.id!]: true, // Open the accordion for the current menu item in path
      }));
    }
  }, [isInPath]);

  return (
    <li key={menuItem.uid} className={`${isTierOne ? "item" : ""}`}>
      {menuItem.children && menuItem.children.length > 0 ? (
        <Accordion
          type="single"
          collapsible
          className={`submenu_acc`}
          value={accordionState?.[menuItem.id!] ? "open" : "closed"}
        >
          <AccordionItem value={"open"} className="acc_item">
            <AccordionTrigger
              className={`heading ${
                isInPath || accordionState?.[menuItem.id!] ? "is_in_path" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isTierOne) {
                  setAccordionState({
                    [menuItem.id!]: !accordionState?.[menuItem.id!],
                  });
                } else {
                  setAccordionState((prev) => ({
                    ...prev,
                    [menuItem.id!]: !prev?.[menuItem.id!],
                  }));
                }
              }}
            >
              <span className="category_name">{menuItem.name}</span>
            </AccordionTrigger>
            <AccordionContent className="acc_content">
              <ul className={`drop_down `}>
                {menuItem.children.map((node) => (
                  <MenuItem
                    key={node?.uid}
                    menuItem={node as CategoryTree}
                    pathname={pathname}
                    cat_id={catId || cat_id}
                    selectedPath={selectedPath}
                    accordionState={accordionState}
                    setAccordionState={setAccordionState}
                  />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // console.log("category id", menuItem.id);
              router.push(`/${menuItem?.url_path}${menuItem?.url_suffix}`);
            }}
            className={`link_item ${isInPath ? "active" : ""} ${
              menuItem.children?.length ? "haschild" : ""
            }`}
          >
            {!isTierOne ? <span className="indicator">-</span> : null}
            <span>{menuItem.name}</span>
          </button>
          {menuItem.children && menuItem.children.length > 0 && (
            <ul className={`drop_down `}>
              {menuItem.children.map((node) => (
                <MenuItem
                  key={node?.uid}
                  menuItem={node as CategoryTree}
                  pathname={pathname}
                  cat_id={catId || cat_id}
                  selectedPath={selectedPath}
                  accordionState={accordionState}
                  setAccordionState={setAccordionState}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
};

function LayeredCategoryFilter({ cat_id }: { cat_id: string }) {
  const { flattenCategoryTree, getCategoryPath, getAccordionState } =
    useCategory();
  const pathname = usePathname();
  const { data, loading, error } = useQuery<
    CategoryQuery["Response"],
    CategoryQuery["Variables"]
  >(CATEGORY);
  const flatenedCategoryTree = useMemo(
    () => flattenCategoryTree(data?.categories.items as CategoryTree[]),
    [data?.categories, flattenCategoryTree]
  );

  const selectedPath = useMemo(
    () => (cat_id ? getCategoryPath(flatenedCategoryTree, cat_id) : []),
    [cat_id, flatenedCategoryTree, getCategoryPath]
  );

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

  const [accordionState, setAccState] = useState<Record<
    string,
    boolean
  > | null>(null);

  // Update accordion state only once when data or selectedPath changes
  useEffect(() => {
    if (data?.categories.items?.length) {
      const accordionStateObj = getAccordionState(
        data.categories.items as CategoryTree[]
      );

      if (accordionStateObj) {
        setAccState((prevState) => {
          const newState = {
            ...accordionStateObj,
          };

          selectedPath.forEach((id) => {
            newState[id] = true;
          });

          // Return only if the state is truly updated to prevent unnecessary renders
          return JSON.stringify(prevState) === JSON.stringify(newState)
            ? prevState
            : newState;
        });
      }
    }
  }, [data?.categories.items]);
  // console.log("cat id", cat_id);
  // console.log("acc state", accordionState);
  // console.log("selected path", selectedPath);

  if(loading) return (<CategorySkeleton noOfItems={13}/>)

  return (
    <div className={`layered_filter ${styles.layered_filter}`}>
      <h2 className="sentence_case">{`Filter by Category`}</h2>
      <div className="category_list_wrap">
        <ul className="lists">
          {sortedChildren?.map((node, i) => (
            <MenuItem
              key={node?.uid}
              menuItem={node as CategoryTree}
              pathname={pathname}
              cat_id={cat_id}
              selectedPath={selectedPath}
              isTierOne
              accordionState={accordionState}
              setAccordionState={setAccState}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LayeredCategoryFilter;
