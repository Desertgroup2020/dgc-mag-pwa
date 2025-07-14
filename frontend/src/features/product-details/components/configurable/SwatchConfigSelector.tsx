import {
  ConfigurableProductOptions,
  ConfigurableProductOptionsValues,
  SwatchDataInterface,
} from "@/generated/types";
import React from "react";
import dynamic from "next/dynamic";

const ColorSwatchItem = dynamic(()=> import("./swatch-items/ColorSwatchItem"), {
  loading: ()=> <span>loading swatch..</span>
});
const TextSwatchItem = dynamic(()=> import("./swatch-items/TextSwatchItem"), {
  loading: ()=> <span>loading swatch..</span>
});

function SwatchConfigSelector({
  configItem,
}: {
  configItem: ConfigurableProductOptions;
}) {
  const { attribute_uid, values, attribute_code, label } = configItem;

  const swatchSwitcher = (option: ConfigurableProductOptionsValues) => {
    const swatchType = (
      option.swatch_data as SwatchDataInterface & { __typename: string }
    )?.__typename as "ImageSwatchData" | "TextSwatchData" | "ColorSwatchData";

    switch (swatchType) {
      case "ColorSwatchData":
        return (
          <ColorSwatchItem
            option={option}
            attributeUid={attribute_uid}
            attributeCode={attribute_code as string}
          />
        );
      case "ImageSwatchData":
        return null;

      case "TextSwatchData":
        return (
          <TextSwatchItem
            option={option}
            attributeUid={attribute_uid}
            attributeCode={attribute_code as string}
          />
        );

      default:
        break;
    }
  };

  // console.log("config values", values);

  return (
    <div className="swatch_config_selector">
      <h3 className="label">{label}:</h3>
      <div className="swatch_item">
        {values?.map((option, i) => {
          return swatchSwitcher(option as ConfigurableProductOptionsValues);
        })}
      </div>
    </div>
  );
}

export default SwatchConfigSelector;
