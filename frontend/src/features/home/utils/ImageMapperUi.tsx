"use client";

import { MapArea, MappedImage } from "@/generated/types";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { AreaEvent, CustomArea, MapAreas } from "react-img-mapper";
import ImageMapper from "react-img-mapper";
import { taggedImageInitialState, taggedImageReducer } from "./reducers";
import { useAppSelector } from "@/redux/hooks";

interface ExtendedImageMapperProps {
  imageWithMap: MappedImage;
  index: number;
  baseWidth: number;
  baseHeight: number;
  containerDim: { width: number; height: number };
  templateId: number;
  templateType?: string;
}
function ImageMapperUi(props: ExtendedImageMapperProps) {
  const {
    baseHeight,
    baseWidth,
    imageWithMap,
    index,
    containerDim,
    templateType,
    templateId,
  } = props;
  const imageMapperRef = useRef<HTMLDivElement | null>(null);
  const [state, dispatch] = useReducer(
    taggedImageReducer,
    taggedImageInitialState
  );
  const isMultiple = useMemo(
    () => templateType !== "with_link",
    [templateType]
  );
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  // setting area may be change when area becomes array
  // const [areas, setAreas] = useState<MapAreas[]>([]);

  const setAreaArray = useCallback(() => {
    const widthScale = containerDim?.width / baseWidth;
    const heightScale = containerDim?.height / baseHeight;

    // console.log("window width", winWidth);

    const areas = (imageWithMap.area as MapArea[]).map((area, i) => {
      const coords = (area.coords?.split(",").map(Number) as number[]).map(
        (coord, i) => {
          return i === 0
            ? coord * widthScale
            : i === 1
            ? coord * heightScale
            : winWidth && winWidth < 768
            ? 10
            : 10;
        }
      ) as number[];

      return {
        shape: "circle",
        coords: coords,
        href: isMultiple
          ? area.link_info?.external_url || "https://www.w3schools.com/"
          : area.link,
        lineWidth: winWidth && winWidth < 768 ? 10 : 10,
        strokeColor: "rgba(68, 142, 67, 0.95)",
        preFillColor: "rgba(244, 244, 244, 0)",
        fillColor: "rgba(244, 244, 244, 1)",
      } as MapAreas;
    });

    // setAreas(areas);
    dispatch({
      type: "SET_MAP_AREAS",
      payload: areas,
    });
  }, [
    containerDim,
    baseHeight,
    baseWidth,
    imageWithMap,
    state.areas,
    winWidth,
  ]);

  const handleMouseEnter = (
    area: CustomArea,
    index: number,
    event: AreaEvent,
    key: string
  ) => {
    // const key = area.coords.join(",");
    dispatch({
      type: "SET_SHOW_TOOLTIP",
      payload: {
        [key]: true,
      },
    });
  };
  const handleMouseLeave = (
    area: CustomArea,
    index: number,
    event: AreaEvent,
    key: string
  ) => {
    // const key = area.coords.join(",");
    dispatch({
      type: "SET_SHOW_TOOLTIP",
      payload: {
        [key]: false,
      },
    });
  };

  useLayoutEffect(() => {
    if (containerDim) setAreaArray();
  }, [containerDim, baseHeight, baseWidth, imageWithMap]);

  // useEffect(()=>{
  //   setAreaArray();
  // }, [imageWithMap])

  if (!isMultiple) {
    console.table(state.areas);
  }
  // console.log("area state", state.areas);

  return (
    <>
      <div ref={imageMapperRef} style={{ height: "100%" }}>
        <div
        className="interactive_map_wrap"
          role="application"
          aria-label="Interactive image map"
          aria-describedby={`description-${templateId}-${index}`}
        >
          <p id={`description-${templateId}-${index}`} className="sr-only">
            This is an interactive image with clickable areas. Use the areas to
            explore more details.
          </p>
          <ImageMapper
            src={imageWithMap?.image as string}
            onMouseEnter={(area, i, e) =>
              handleMouseEnter(area, i, e, `area${templateId}${index}${i}`)
            }
            onMouseLeave={(area, i, e) =>
              handleMouseLeave(area, i, e, `area${templateId}${index}${i}`)
            }
            height={containerDim?.height || 0}
            width={containerDim?.width || 0}
            map={{
              name: `map${templateId}${index}`,
              areas: state.areas as MapAreas[],
            }}
            parentWidth={containerDim?.height || 0}
            onLoad={setAreaArray}
          />
        </div>

        {state.areas?.map((area, i) => {
          // const key = area.coords.join(",");
          return (
            <div
              key={`area${templateId}${index}${i}`}
              style={{
                position: "absolute",
                top: area.coords?.[1] + 20 + "px",
                left: area.coords?.[0],
                zIndex: 999,
              }}
              className={`tooltip text-cat_font ${
                state.showTooltip?.[`area${templateId}${index}${i}`]
                  ? "show"
                  : ""
              }`}
            >
              <span>
                {(imageWithMap?.area as MapArea[])?.[i]?.toolTip ||
                  "No text provided"}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ImageMapperUi;
