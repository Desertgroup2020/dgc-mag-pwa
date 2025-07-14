import { ConfigurableProductOptionsValues } from "@/generated/types";
import { useConfigurableContext } from "../configurableContext";
import { isSelectedConfigOption } from "../utils";

export default function ColorSwatchItem({
  option,
  attributeCode,
}: {
  option: ConfigurableProductOptionsValues;
  attributeUid: string;
  attributeCode: string;
}) {
  //constands
  const hexCode = option.swatch_data?.value as string;

  //hooks & states
  const { updateConfigOptions, configState } = useConfigurableContext();

  return (
    <button
      className="color_opt"
      onClick={() =>
        updateConfigOptions({
          attribute_code: attributeCode as string,
          isMultiselect: false,
          value: option.uid as string,
        })
      }
    >
      <div
        className={`clr ${
          isSelectedConfigOption({
            attributeCode: attributeCode,
            configOptions: configState.configurableOptions,
            option: option,
          })
            ? "checked"
            : ""
        }`}
        style={{
          backgroundColor: hexCode,
          color: hexCode === "#000000" ? "#fff" : "inherit",
        }}
      ></div>
      <div
        className={`color_label ${
          isSelectedConfigOption({
            attributeCode: attributeCode,
            configOptions: configState.configurableOptions,
            option: option,
          })
            ? "checked"
            : ""
        }`}
      >
        <span>{option.label}</span>
      </div>
    </button>
  );
}
