import { ConfigurableProductOptionsValues } from "@/generated/types";

export const isSelectedConfigOption = ({
  attributeCode,
  configOptions,
  option,
}: {
  attributeCode: string;
  configOptions: { [key: string]: string | string[] };
  option: ConfigurableProductOptionsValues;
}) => {
  if (Object.keys(configOptions).find((key) => key === attributeCode)) {
    const attrStateValue = configOptions?.[attributeCode];

    if (Array.isArray(attrStateValue)) {
      return !!attrStateValue.find((optUid) => optUid === option.uid);
    } else {
      return attrStateValue === option.uid;
    }
  } else {
    return false;
  }
};
