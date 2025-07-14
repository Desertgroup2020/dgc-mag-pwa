import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BundleCartItem, CartItemInterface } from "@/generated/types";
import { usePrice } from "@/utils";
import { ArrowDown } from "lucide-react";
import React, { useState } from "react";

type BundleProductLister = {
  cartItem: BundleCartItem;
};
function BundleProductLister({ cartItem }: BundleProductLister) {
  const { renderPrice } = usePrice();

  //   states
  const [showBunldeItems, setShowBundleItems] = useState(false);

//   features
const handleBundleOpen = ()=>
    setShowBundleItems((prev)=> !prev)


  return (
    <>
      <Popover open={showBunldeItems} onOpenChange={handleBundleOpen}>
        <PopoverTrigger className="flex items-center cart_bundle_popover_trigger" asChild>
          <button >
            <span>associated Products</span>
            <ArrowDown />
          </button>
        </PopoverTrigger>
        <PopoverContent className="cart_bundle_popover">
          <div className="child_options">
            {(cartItem as BundleCartItem).bundle_options.map((option, i) => (
              <div className="option" key={option?.uid}>
                <span className="label">{option?.label} : &nbsp;</span>
                <div className="option_items">
                  {option?.values.map((selectedProduct, i) => (
                    <div className="option_item" key={selectedProduct?.id}>
                      <p className="name">{selectedProduct?.label}</p>
                      <span className="price">
                        {renderPrice(selectedProduct?.price)}
                      </span>
                      {/* <span className="qty">{selectedProduct?.quantity}</span> */}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default BundleProductLister;
