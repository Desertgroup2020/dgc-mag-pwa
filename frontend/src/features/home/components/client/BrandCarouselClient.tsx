"use client";

import styles from "../../styles/brandcarousel.module.scss";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AutoplayOptionsType } from "embla-carousel-autoplay";
import { FeaturedBrandsBlock } from "@/generated/types";
import Link from "next/link";
import dynamic from "next/dynamic";
// import BtnRightArrow from "@/components/icons/BtnRightArrow";

const BtnRightArrow = dynamic(() => import("@/components/icons/BtnRightArrow"));

interface BrandCarouselProps {
  featuredBrandsBlock: FeaturedBrandsBlock;
}
const BrandCarousel = ({ featuredBrandsBlock }: BrandCarouselProps) => {
  const { featured_brands } = featuredBrandsBlock;
  const autoplayOptions: AutoplayOptionsType = {
    delay: 2000,
  };

  return (
    <div className={`brand_carousel_home ${styles.brand_carousel_home}`}>
      <div className="brand_side">
        <h2 className="brand_side_title text-h2">Choose from top brands</h2>
        <Link href={"/brands"} className="view_all">
          <BtnRightArrow fill="#7e8b53" stroke="#7e8b53" className="icon" />
          <span>View all</span>
        </Link>
      </div>

      <div className="brand_block_home">
        <Carousel
          className="product_carousel"
          opts={{
            loop: true,
            slidesToScroll: 3,
            breakpoints: {
              "(max-width: 767px)": { slidesToScroll: 1 },
            },
          }}
          plugins={
            [
              // Autoplay(autoplayOptions)
            ]
          }
        >
          <CarouselContent className="ml-0">
            {featured_brands?.map((brand, i) => (
              <CarouselItem
                key={i}
                className={`brand_center pl-0 basis-1/4 ipadpro:basis-1/3 basis-1/5 carousel_item `}
              >
                <Link href={`/brands/${brand?.brand_id}`}>
                  <Image
                    className="brand_widget"
                    src={brand?.image || ""}
                    alt="brands"
                    width={200}
                    height={97}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="controls">
            <CarouselPrevious className="nav nav_prev static translate-y-0" />
            <CarouselNext className="nav nav_next static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default BrandCarousel;
