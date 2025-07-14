import { Input } from "@/components/ui/input";
import { BundleSelectionError, useBundleContext } from "../hooks/bundleContext";
import { BundleItem, ProductInterface } from "@/generated/types";
import useProduct from "@/components/product/useProduct";
import Image from "next/image";
import { usePrice } from "@/utils";

interface RadioOptionProps {
  bundleItem: BundleItem;
  error: BundleSelectionError | null;
}

type RadioProductCardProps = {
  product: ProductInterface;
  isSelected: boolean;
};
export const RadioProductCard: React.FC<RadioProductCardProps> = ({
  isSelected,
  product,
}) => {
  const { productImage, title, price } = useProduct({ product });
  const { renderPrice } = usePrice();

  return (
    <div className={`product_card_bundle_radio ${isSelected ? "active" : ""}`}>
      <figure>
        <Image
          src={`${productImage?.url}`}
          alt={title || "product"}
          width={160}
          height={90}
        />
      </figure>
      <div className="cnt">
        <h4>{title}</h4>
        <span className="price">{renderPrice(price || 0)}</span>
      </div>
    </div>
  );
};

const RadioOption: React.FC<RadioOptionProps> = ({ bundleItem }) => {
  const { bundleTrackstate, dispatch } = useBundleContext();

  const selectedValue =
    bundleTrackstate?.[bundleItem.option_id || 0]?.values[0] || "";

  const handleChange = (value: string) => {
    dispatch({
      type: "UPDATE_RADIO",
      bundleItemId: bundleItem.option_id?.toString() || "",
      value,
      qty: 1,
    });
  };

  return (
    <div className="radio_option">
      <h3 className="bundle_item_name text-h3">{bundleItem.title}</h3>
      <div className="option_list">
        {bundleItem.options?.map((option) => (
          <label
            key={option?.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={`bundle-${bundleItem.option_id}`}
              value={option?.id || ""}
              checked={selectedValue === option?.id?.toString()}
              onChange={() => handleChange(option?.id?.toString() || "")}
              className="hidden"
            />
            <RadioProductCard
              isSelected={selectedValue === option?.id?.toString()}
              product={option?.product!}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioOption;
