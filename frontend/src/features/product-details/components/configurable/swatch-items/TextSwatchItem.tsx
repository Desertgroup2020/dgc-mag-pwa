import { ConfigurableProductOptionsValues } from "@/generated/types";
import { useConfigurableContext } from "../configurableContext";
import { isSelectedConfigOption } from "../utils";

export default function TextSwatchItem({
    option,
    attributeUid,
    attributeCode,
  }: {
    option: ConfigurableProductOptionsValues;
    attributeUid: string;
    attributeCode: string;
  }) {
    //constands
    const txtValue = option.swatch_data?.value as string;
  
    //hooks & states
    const { updateConfigOptions, configState } = useConfigurableContext();
  
    return (
      <button
        className="text_opt"
        onClick={() =>
          updateConfigOptions({
            attribute_code: attributeCode as string,
            isMultiselect: false,
            value: option.uid as string,
          })
        }
      >
        <div
          className={`txt ${
            isSelectedConfigOption({
              attributeCode: attributeCode,
              configOptions: configState.configurableOptions,
              option: option,
            })
              ? "checked"
              : ""
          }`}          
        >
            <span>{txtValue}</span>
        </div>
      </button>
    );
  }