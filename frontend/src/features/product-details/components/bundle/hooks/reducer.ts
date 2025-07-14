export type BundleState = Record<
  string,
  { values: string[]; required: boolean; qty: number }
>;

export type BundleAction =
  | { type: "UPDATE_RADIO"; bundleItemId: string; value: string, qty: number }
  | { type: "UPDATE_CHECKBOX"; bundleItemId: string; value: string, qty: number }
  | { type: "UPDATE_SELECT"; bundleItemId: string; value: string,qty: number }
  | { type: "UPDATE_QTY"; bundleItemId: string; qty: number }
  | { type: "SET_REQUIRED"; bundleItemId: string; required: boolean };

const bundleReducer = (
  state: BundleState,
  action: BundleAction
): BundleState => {
  switch (action.type) {
    case "UPDATE_RADIO":
    case "UPDATE_SELECT":
      return {
        ...state,
        [action.bundleItemId]: {
          ...state[action.bundleItemId],
          values: [action.value], // Single selection
        },
      };

    case "UPDATE_CHECKBOX":
      return {
        ...state,
        [action.bundleItemId]: {
          ...state[action.bundleItemId],
          values: state[action.bundleItemId]?.values.includes(action.value)
            ? state[action.bundleItemId].values.filter(
                (v) => v !== action.value
              )
            : [...(state[action.bundleItemId]?.values || []), action.value], // Toggle value
        },
      };

    case "SET_REQUIRED":
      return {
        ...state,
        [action.bundleItemId]: {
          ...state[action.bundleItemId],
          required: action.required,
        },
      };
    case "UPDATE_QTY":
      return {
        ...state,
        [action.bundleItemId]: {
          ...state[action.bundleItemId],
          qty: action.qty,
        },
      };

    default:
      return state;
  }
};

export default bundleReducer;
