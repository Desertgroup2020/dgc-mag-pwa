// "use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Slider, SliderBlock } from "@/generated/types";
import sliderBlockStyles from "../../styles/sliderblock.module.scss";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useHomepage from "../../utils/useHomepage";
import Link from "next/link";
import dynamic from "next/dynamic";

const BtnRightArrow = dynamic(() => import("@/components/icons/BtnRightArrow"));

interface SliderBlockProps {
  sliderBlock: SliderBlock;
}

const SliderItem = ({ slider }: { slider: Slider }) => {
  const { getBlockRedirectLink } = useHomepage();
  const {title_color, description_color} = slider;
  return (
    <div className={`slider_card ${sliderBlockStyles.slider_card} relative`}>
      <Image
        src={slider?.slider_image || ""}
        alt="slider"
        width={1920}
        height={785}
        className="w-auto slider_img"
        layout="responsive"
        priority
        placeholder="blur"
        blurDataURL="/banner_slider.jpg"
      />
      <div className="content absolute w-full left-0 bottom-0 text">
        <div className="container">
          <div className="txt">
            <p className="text-h1 mb-h1_btm" style={{color: `${title_color}`}}>{slider.title}</p>
            <span className=" text-h3 font-600 block sub_txt mb-4" style={{color: `${description_color}`}}>
              {slider.description}
            </span>
            {slider.display_button ? (
              <Link href={getBlockRedirectLink(slider.link_info!) || "/"}>
                <Button
                  variant={"action_green"}
                  className="btn_action_green_rounded"
                >
                  <BtnRightArrow stroke="#4D926C" />
                  <span>View more</span>
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

function SliderBlockClient({ sliderBlock }: SliderBlockProps) {
  return (
    <div className={sliderBlockStyles.slider_block}>
      <Carousel>
        <CarouselContent className="ml-0">
          {sliderBlock?.sliders?.map((slider, i) => {
            return (
              <CarouselItem key={i} className=" pl-0">
                <SliderItem slider={slider!} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="controls">
          <CarouselPrevious className="nav nav_prev static translate-y-0" />
          <CarouselDots className="dots flex" />
          <CarouselNext className="nav nav_next static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}

export default SliderBlockClient;
