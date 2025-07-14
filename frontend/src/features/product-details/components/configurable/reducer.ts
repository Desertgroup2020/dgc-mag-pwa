// configurable state types
export type ConfigStateValues = {
  buyCount: number;
  configurableOptions: {
    [key: string]: string | string[];
  };
};

// Actions
export type ConfigStateAction =
  | { type: "UPDATE_BUY_COUNT"; payload: number }
  | {
      type: "UPDATE_CONFIG_OPTIONS";
      attribute_code: string;
      value: string;
      isMultiselect: boolean;
    };

// Initial state
export const initialConfigState: ConfigStateValues = {
  buyCount: 1,
  configurableOptions: {},
};

// Reducer function
export const configReducer = (
  state: ConfigStateValues,
  action: ConfigStateAction
): ConfigStateValues => {
  switch (action.type) {
    case "UPDATE_BUY_COUNT":
      return {
        ...state,
        buyCount: action.payload,
      };

    case "UPDATE_CONFIG_OPTIONS": {
      const { attribute_code, value, isMultiselect } = action;
      const currentValue = state.configurableOptions[attribute_code];

      if (isMultiselect) {
        let updatedValue = Array.isArray(currentValue) ? [...currentValue] : [];

        // Check if the value is already in the array
        if (updatedValue.includes(value)) {
          // If it exists, remove it
          updatedValue = updatedValue.filter((item) => item !== value);
        } else {
          // If it doesn't exist, add it
          updatedValue.push(value);
        }

        return {
          ...state,
          configurableOptions: {
            ...state.configurableOptions,
            [attribute_code]: updatedValue,
          },
        };
      } else {
        // If not multiselect, replace the existing value
        return {
          ...state,
          configurableOptions: {
            ...state.configurableOptions,
            [attribute_code]: value,
          },
        };
      }
    }

    default:
      return state;
  }
};
