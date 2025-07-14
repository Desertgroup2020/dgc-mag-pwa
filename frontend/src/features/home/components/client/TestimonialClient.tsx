"use client";

import { Testimonial, TestimonialBlock } from "@/generated/types";
import React from "react";
import styles from "../../styles/testimonial.module.scss";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AutoplayOptionsType } from "embla-carousel-autoplay";
import ClassNames from "embla-carousel-class-names";
import Link from "next/link";
import { LinkIcon } from "lucide-react";

interface TestimonialClientProps {
  testimonialBlock: TestimonialBlock;
}
interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { added_at, image, customer_name, description, source } = testimonial;
  return (
    <div className={`testimonial_card ${styles.testimonial_card}`}>
      <div className="inner">
        <div className="profile">
          <figure className="avatar">
            <Image
              src={testimonial.image || `/uicon.png`}
              alt="avatar"
              width={40}
              height={40}
            />
          </figure>
          <div className="text_details">
            <h4>{customer_name}</h4>
            <span className="dop">{added_at}</span>
          </div>
        </div>
        <div className="description">
          <p>{description}</p>
        </div>
        <div className="source">
          <Link href={`${source?.url}`} target="_blank" rel="Source">
            <figure>
              <Image
                src={`${source?.image}`}
                alt={`${source?.title}`}
                width={30}
                height={30}
              />
            </figure>
            <div className="title">
              <span>{source?.title}</span>
              <LinkIcon size={15}/>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
function TestimonialClient({ testimonialBlock }: TestimonialClientProps) {
  const autoplayOptions: AutoplayOptionsType = {
    delay: 3000,    
  };

  return (
    <div className="testimonial_list">
      <Carousel
        className="testimonial_carousel"
        opts={{ loop: true, slidesToScroll: 1 }}
        plugins={[
          // Autoplay(autoplayOptions),
          ClassNames({
            snapped: "center",
          }),
        ]}
      >
        <CarouselContent className="ml-0 items-center">
          {testimonialBlock.testimonial_info?.map((testimonial, i) => (
            <CarouselItem
              key={i}
              className={`brand_center p-0 basis-1/3 mobile_basis-100 carousel_item`}
            >
              <TestimonialCard
                key={testimonial?.testimonial_id}
                testimonial={testimonial as Testimonial}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="controls">
          <CarouselPrevious className="nav nav_prev static translate-y-0" />
          <CarouselNext className="nav nav_next static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}

export default TestimonialClient;
