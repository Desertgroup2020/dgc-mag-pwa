"use client";

import { MappedImage, TaggedImageBlock } from "@/generated/types";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ImageMapperUi from "../../utils/ImageMapperUi";
import { getImageDimensions } from "../../utils/getImageDimensions";
import { useAppSelector } from "@/redux/hooks";
import { debounce } from "@/lib/utils";

interface TaggedImageClientProp {
  tagedImageBlock: TaggedImageBlock;
}

function TaggedImageClient({ tagedImageBlock }: TaggedImageClientProp) {
  const mapContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (element: HTMLDivElement | null, index: number) => {
    mapContainerRefs.current[index] = element;
  };
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  const [initialDim, setInitialDim] = useState<
    { width: number; height: number }[]
  >([]);
  const [containerDim, setContainerDim] = useState<
    { width: number; height: number }[]
  >([]);
  const [imageWithMaps, setImageWithMaps] = useState<MappedImage[]>([]);
  const getInitialDim = async () => {
    const dimensionsPromises = tagedImageBlock.mapped_image?.map(
      (mappedImage) => {
        return getImageDimensions(mappedImage?.image || "");
      }
    );

    if (dimensionsPromises) {
      const dimensions = await Promise.all(dimensionsPromises);
      setInitialDim(dimensions);
    }
  };
  const calculateDimensions = () => {
    const dims = mapContainerRefs.current.map((ref, i) => {
      return {
        width: ref?.clientWidth || 0,
        height: ref?.clientHeight || 0,
      };
    });
    setContainerDim(dims);
  };
  const imageWithMapSetter = useCallback(() => {
    if (
      winWidth &&
      winWidth < 991 &&
      tagedImageBlock.mapped_mobile_image?.length
    ) {
      setImageWithMaps(tagedImageBlock.mapped_mobile_image as MappedImage[]);
    } else {
      setImageWithMaps(tagedImageBlock.mapped_image as MappedImage[]);
    }
  }, [winWidth, tagedImageBlock, setImageWithMaps]);

  useLayoutEffect(() => {
    calculateDimensions();
  }, [tagedImageBlock, mapContainerRefs, imageWithMaps]);

  useEffect(() => {
    if (imageWithMaps.length) {
      getInitialDim();
    }
  }, [imageWithMaps]);

  useLayoutEffect(() => {
    imageWithMapSetter();
  }, [winWidth, tagedImageBlock]);

  useEffect(() => {
    const debounceAddEventListner = debounce(calculateDimensions, 200);
    window.addEventListener("resize", debounceAddEventListner);

    return () => window.removeEventListener("resize", debounceAddEventListner);
  }, []);

  // console.log(tagedImageBlock.title_position);

  return (
    <div
      className={`grid ${
        tagedImageBlock.title_position !== "left" && "layout2"
      }`}
    >
      <div className="item item1">
        <div className="title_img">
          <Image
            src={tagedImageBlock.title_image || ""}
            alt="Title image"
            width={359}
            height={359}
          />
        </div>
      </div>
      {imageWithMaps?.map((imageWithMap, i) => {
        return (
          <div
            className={`item item${i + 2} map_item`}
            ref={(element) => setRef(element, i)}
            key={i}
          >
            {/* {i === 1 ? ( */}
            <ImageMapperUi
              imageWithMap={imageWithMap as MappedImage}
              index={i}
              baseHeight={initialDim?.[i]?.height as number}
              baseWidth={initialDim?.[i]?.width as number}
              containerDim={containerDim?.[i]}
              templateType={tagedImageBlock.banner_template as string}
              templateId={tagedImageBlock.id as number}
              
            />
            {/* ) : null} */}
          </div>
        );
      })}
    </div>
  );
}

export default TaggedImageClient;
