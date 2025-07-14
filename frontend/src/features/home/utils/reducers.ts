import { TaggedImageAction, TaggedImageState } from "./types";

export const taggedImageInitialState: TaggedImageState = {
  dimension: {
    width: null,
    height: null,
  },
  measureAgain: false,
  showTooltip: {},
  coords: [],
  areas: []
};

export const taggedImageReducer = (
  state: TaggedImageState,
  action: TaggedImageAction
): TaggedImageState => {
  switch (action.type) {
    case "SET_DIMENISON":
      return { ...state, dimension: action.payload };
    case "SET_MEASURE_AGAIN":
      return { ...state, measureAgain: action.payload };
    case "SET_SHOW_TOOLTIP":
      return {
        ...state,
        showTooltip: {
          ...state.showTooltip,
          ...action.payload,
        },
      };
    case "SET_COORDS":
      return { ...state, coords: action.payload };
    case "SET_MAP_AREAS":
      return {...state, areas: action.payload}
    default:
      return state;
  }
};
