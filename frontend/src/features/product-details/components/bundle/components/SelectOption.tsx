import { BundleItem, ProductInterface } from "@/generated/types";
import { BundleSelectionError, useBundleContext } from "../hooks/bundleContext";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioProductCard } from "./RadioOption";

interface SelectOptionProps {
  bundleItem: BundleItem;
  error: BundleSelectionError | null;
}

const SelectOption: React.FC<SelectOptionProps> = ({ bundleItem }) => {
  const { bundleTrackstate, dispatch } = useBundleContext();

  const selectedValue =
    bundleTrackstate[bundleItem.option_id || 0]?.values[0] || "";

  const handleChange = (value: string) => {
    dispatch({
      type: "UPDATE_SELECT",
      bundleItemId: bundleItem.option_id?.toString() || "",
      value,
      qty: 1,
    });
  };

  return (
    <div className="select_bundle_item">
      <h3 className="bundle_item_name text-h3">{bundleItem.title}</h3>
      <Select value={selectedValue} onValueChange={handleChange} >
        <SelectTrigger className="custom_select_view">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="custom_select_content"  >
          {bundleItem.options?.map((option) => (
            <SelectItem key={option?.id} value={option?.id?.toString() || ""} className="w-full">
              <RadioProductCard
                isSelected={selectedValue === option?.id?.toString()}
                product={option?.product as ProductInterface}
              />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectOption;
