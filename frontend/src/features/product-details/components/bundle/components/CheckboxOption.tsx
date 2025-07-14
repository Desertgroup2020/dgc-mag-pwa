import { Input } from "@/components/ui/input";
import { BundleSelectionError, useBundleContext } from "../hooks/bundleContext";
import { BundleItem } from "@/generated/types";
import { Label } from "@/components/ui/label";
import { RadioProductCard } from "./RadioOption";

interface CheckboxOptionProps {
  bundleItem: BundleItem;
  error: BundleSelectionError | null;
}

const CheckboxOption: React.FC<CheckboxOptionProps> = ({ bundleItem,error }) => {
  const { bundleTrackstate, dispatch } = useBundleContext();

  const selectedValues =
    bundleTrackstate[bundleItem?.option_id || 0]?.values || [];

  const handleChange = (optionId: string) => {
    dispatch({
      type: "UPDATE_CHECKBOX",
      bundleItemId: bundleItem.option_id?.toString() || "",
      value: optionId,
      qty: 1,
    });
  };

  return (
    <div className="multi_select_option radio_option">
      <div className="head bundle_item_name flex items-center gap-3">
        <h3 className="text-h3">{bundleItem.title}</h3>
        {
          !!error ? (
            <p className="error text-red-500">{error.error}</p>
          ): null
        }
      </div>
      <div className="option_list">
        {bundleItem.options?.map((option) => (
          <label key={option?.id}>
            <input
              type="checkbox"
              className="hidden"
              value={option?.id || ""}
              checked={selectedValues.includes(option?.id?.toString() || "")}
              onChange={() => handleChange(option?.id?.toString() || "")}
            />

            <RadioProductCard
              isSelected={selectedValues.includes(option?.id?.toString() || "")}
              product={option?.product!}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxOption;
