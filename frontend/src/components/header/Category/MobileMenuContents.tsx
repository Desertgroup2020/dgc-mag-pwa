import CategorySkeleton from "@/components/loader/CategorySkeleton";
import {
  CATEGORY,
  CategoryQuery,
} from "@/features/categories/apollo/query/category";
import { CategoryTree } from "@/generated/types";
import { useQuery } from "@apollo/client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/mobileMenu.module.scss";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { GET_DYNAMIC_MENU, GetDynamicMenuType } from "../queries";

interface MobileMenuContentsProps {
  handleClose: (open: boolean) => void;
}
function MobileMenuContents({ handleClose }: MobileMenuContentsProps) {
  const { data, loading } = useQuery<
    CategoryQuery["Response"],
    CategoryQuery["Variables"]
  >(CATEGORY);

  const categories = useMemo(() => data?.categories?.items?.[0], [data]);

  const [currentTier, setCurrentTier] = useState<"tier1" | "tier2" | "tier3">(
    "tier1"
  );
  const [categoryTier1, setCategoryTier1] = useState<CategoryTree | null>(null);
  const [categoryTier2, setCategoryTier2] = useState<CategoryTree | null>(null);
  const [categoryTier3, setCategoryTier3] = useState<CategoryTree | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const onTierChange = (uid: string, type: "tier1" | "tier2" | "tier3") => {
    setDirection("forward");
    switch (type) {
      case "tier1":
        const category =
          categoryTier1?.children?.find((category) => category?.uid === uid) ||
          null;
        setCategoryTier2(category);
        setCurrentTier("tier2");
        break;
      case "tier2":
        const category2 =
          categoryTier2?.children?.find((category) => category?.uid === uid) ||
          null;
        setCategoryTier3(category2);
        setCurrentTier("tier3");
        break;
      default:
        break;
    }
  };

  const onBack = () => {
    setDirection("backward");
    switch (currentTier) {
      case "tier2":
        setCurrentTier("tier1");
        break;
      case "tier3":
        setCurrentTier("tier2");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setCategoryTier1(categories as any);
    // alert(`categories ${categories?.name}`)
  }, [categories]);

  if (loading) {
    return <CategorySkeleton noOfItems={13} />;
  }

  return (
    <div className={`mobile_menu ${styles.mobile_menu}`}>
      <Screen
        item={categoryTier1}
        type="tier1"
        onTierChange={(uid) => onTierChange(uid, "tier1")}
        onBack={onBack}
        direction={direction}
        isActive={currentTier === "tier1"}
        handleClose={handleClose}
      />
      <Screen
        item={categoryTier2}
        type="tier2"
        onTierChange={(uid) => onTierChange(uid, "tier2")}
        onBack={onBack}
        direction={direction}
        isActive={currentTier === "tier2"}
        handleClose={handleClose}
      />
      <Screen
        item={categoryTier3}
        type="tier3"
        onTierChange={(uid) => onTierChange(uid, "tier3")}
        onBack={onBack}
        direction={direction}
        isActive={currentTier === "tier3"}
        handleClose={handleClose}
      />
    </div>
  );
}

export default MobileMenuContents;

type ScreenProps = {
  item: CategoryTree | null;
  type: "tier1" | "tier2" | "tier3";
  onTierChange: (uid: string) => void;
  onBack: () => void; // Add onBack prop
  direction: "forward" | "backward"; // Add direction prop
  isActive: boolean;
  handleClose: (open: boolean) => void;
};

function Screen({
  item,
  onTierChange,
  type,
  onBack,
  direction,
  isActive,
  handleClose,
}: ScreenProps & { isActive: boolean }) {
  const { data, loading } = useQuery<GetDynamicMenuType["Response"]>(
    GET_DYNAMIC_MENU,
    {
      fetchPolicy: "no-cache",
    }
  );
  const screenRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t1 = gsap.timeline({ paused: true });

      if (isActive) {
        if (direction === "forward") {
          t1.fromTo(
            screenRef.current,
            { x: "100%", opacity: 0 },
            { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
          );
        } else if (direction === "backward") {
          t1.fromTo(
            screenRef.current,
            { x: "-100%", opacity: 0 },
            { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
          );
        }
        t1.play();
      } else {
        if (direction === "forward") {
          t1.to(screenRef.current, {
            x: "-100%",
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        } else if (direction === "backward") {
          t1.to(screenRef.current, {
            x: "100%",
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        }
        t1.play();
      }
    }, screenRef);

    return () => ctx.revert();
  }, [item, direction, isActive]);

  return (
    <div
      ref={screenRef}
      className={`screen ${type}`}
      style={{ display: isActive ? "block" : "none" }}
    >
      {type !== "tier1" && (
        <div className="head">
          <h2>
            <span>{item?.name}</span>
          </h2>
          <Button onClick={onBack}>
            <ChevronLeft />
          </Button>
        </div>
      )}

      {item?.children?.length ? (
        <ul className="menu_links">
          {item.children.map((category) => (
            <li
              key={category?.uid}
              className={category?.children?.length ? "haschild" : ""}
            >
              <Link
                href={`/${category?.url_path}${category?.url_suffix}`}
                onClick={(e) => {
                  if (category?.children?.length) {
                    e.preventDefault();
                    onTierChange(category.uid);
                  } else {
                    handleClose(false);
                  }
                }}
              >
                <span>{category?.name}</span>
              </Link>
            </li>
          ))}
          {type === "tier1"
            ? data?.getMenu.headerMenu?.menuItems?.map((menuItem, i) => (
                <li key={i}>
                  <Link href={`/${menuItem?.link}`} onClick={()=> handleClose(false)}>
                    <span>{menuItem?.text}</span>
                  </Link>
                </li>
              ))
            : null}
        </ul>
      ) : null}
    </div>
  );
}
