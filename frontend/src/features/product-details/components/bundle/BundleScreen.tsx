import React, { useCallback, useEffect, useState } from "react";
import {
  BundleSelectionErrortype,
  useBundleContext,
} from "./hooks/bundleContext";
import SelectOption from "./components/SelectOption";
import { BundleItem, BundleProduct } from "@/generated/types";
import RadioOption from "./components/RadioOption";
import CheckboxOption from "./components/CheckboxOption";
import { Button } from "@/components/ui/button";
import useProduct from "@/components/product/useProduct";
import { usePdpContext } from "../../hooks/pdpContext";
import CartIcon from "@/components/icons/CartIcon";
import useCart from "@/features/cart/hooks/useCart";
import CircularProgress from "@/components/icons/CircularProgress";
import styles from "../../styles/style.module.scss";

type BundleScreenProps = {
  product: BundleProduct;
};
function BundleScreen({ product }: BundleScreenProps) {
  const { bundleItems, grandPermissionForAddToCart, bundleTrackstate } =
    useBundleContext();
  const { isInStock, sku } = useProduct({
    product,
  });
  const { handleBundleAddToCart, addingToCart } = useCart();
  const { stockStatusLabel } = usePdpContext();

  // states
  const [errorstates, setErrorStates] = useState<BundleSelectionErrortype | []>(
    []
  );

  // features
  const renderDifferentbundleOptions = useCallback(
    (bundleItem: BundleItem) => {
      switch (bundleItem.type) {
        case "radio":
          return (
            <RadioOption
              bundleItem={bundleItem}
              error={
                errorstates.find(
                  (err) => err.bundleItemId === bundleItem.option_id?.toString()
                ) || null
              }
            />
          );

        case "select":
          return (
            <SelectOption
              bundleItem={bundleItem}
              error={
                errorstates.find(
                  (err) => err.bundleItemId === bundleItem.option_id?.toString()
                ) || null
              }
            />
          );

        default:
          return (
            <CheckboxOption
              bundleItem={bundleItem}
              error={
                errorstates.find(
                  (err) => err.bundleItemId === bundleItem.option_id?.toString()
                ) || null
              }
            />
          );
      }
    },
    [errorstates]
  );

  const onAddtoCart = useCallback(async () => {
    try {
      const bundleOptions = (await grandPermissionForAddToCart).bundle_options;
      if (bundleOptions.length && sku) {
        handleBundleAddToCart({
          name: product.name || "",
          cartItems: [
            {
              data: {
                quantity: 1,
                sku,
              },
              bundle_options: bundleOptions,
            },
          ],
        });
      } else {
        setErrorStates([]);
      }
    } catch (errros) {
      setErrorStates(errros as BundleSelectionErrortype);
    }
  }, [grandPermissionForAddToCart, product]);

  // effects
  useEffect(() => {
    grandPermissionForAddToCart.then(()=>{
      setErrorStates([])
    }).catch((errs) => {
      setErrorStates(errs as BundleSelectionErrortype);
    });
  }, [bundleTrackstate]);

  return (
    <div className={`bundle_screen ${styles.bundle_screen}`}>
      {bundleItems?.map((item) => renderDifferentbundleOptions(item))}

      <Button
        variant={"action_green"}
        className={`btn_action_green_sqr text-pcard_title text-white`}
        style={
          !isInStock
            ? {
                color: "#cc0c39",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }
            : {}
        }
        disabled={addingToCart || stockStatusLabel === "Out of stock" || !!errorstates.length}
        onClick={onAddtoCart}
      >
        {addingToCart ? (
          <span>
            <CircularProgress />
          </span>
        ) : (
          <CartIcon className="icon" />
        )}
        <span>{!isInStock ? "OUT OF STOCK" : "Add To Cart"}</span>
      </Button>
    </div>
  );
}

export default BundleScreen;
