import { MapArea } from "@/generated/types";
import { MapAreas } from "react-img-mapper";

export interface TaggedImageState {
  dimension: {
    height: number | null;
    width: number | null;
  };
  measureAgain: boolean;
  showTooltip: {
    [key: string]: boolean
  };
  coords: number[] | number[][];
  areas: MapAreas[]
}
export type TaggedImageAction =
  | {
      type: "SET_DIMENISON";
      payload: {
        height: number | null;
        width: number | null;
      };
    }
  | { type: "SET_COORDS"; payload: number[] | number[][] }
  | { type: "SET_MEASURE_AGAIN"; payload: boolean }
  | { type: "SET_MAP_AREAS"; payload: MapAreas[] }
 
  | { type: "SET_SHOW_TOOLTIP"; payload: {
    [key: string]: boolean
  } };
