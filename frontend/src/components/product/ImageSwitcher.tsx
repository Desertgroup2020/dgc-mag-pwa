"use client";

import { MediaGalleryInterface, ProductImage } from "@/generated/types";
import { delay } from "@/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export type ImageSwitcherType = {
  images: { url: string }[] | [];
};
function ImageSwitcher({ images }: ImageSwitcherType) {
  // states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // features

  useEffect(() => {
    if (isHovering) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      delay(1200);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1200); // Change image every 1 second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentIndex(0); // Reset to the first image when not hovering
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovering, images.length]);

  return (
    <>
      <figure
        className="prd_img"
        onMouseEnter={() => setIsHovering(true)} // Start cycling on hover
        onMouseLeave={() => setIsHovering(false)} // Reset on mouse leave
      >
        <Image
          src={images[currentIndex].url}
          alt={"product image"}
          width={242}
          height={244}          
          style={{
            width: "auto",
            height: "auto",
          }}
          className="transition-opacity duration-500 ease-in-out"
        />
      </figure>
    </>
  );
}

export default ImageSwitcher;
