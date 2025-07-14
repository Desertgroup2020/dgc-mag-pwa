import React, { useState, useEffect } from "react";
import { usePdpContext } from "../hooks/pdpContext";
import dynamic from "next/dynamic";
import styles from "../styles/style.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";
import VideoLoader from "@/components/loader/VideoLoader";
import ImageLoader from "@/components/loader/ImageLoader";
import VideoPause from "@/components/icons/VideoPause";
import { ProductInterface } from "@/generated/types";
import useProduct from "@/components/product/useProduct";
import { useAppSelector } from "@/redux/hooks";

// Dynamic imports for ImageHolder and VideoHolder components
const ImageHolder = dynamic(() => import("../components/ImageHolder"), {
  loading: () => {
    return <ImageLoader />;
  },
});
const VideoHolder = dynamic(() => import("../components/VideoHolder"), {
  loading: () => {
    return <VideoLoader />;
  },
});

function MediaScreen({ product }: { product: ProductInterface }) {
  // hooks
  const { mpProductLabel } = useProduct({
    product: product as ProductInterface,
  });
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  // constants

  const { mediaList, currentMedia, setCurrentMedia } = usePdpContext();
  const [activeThumbIndex, setActiveThumbIndex] = useState<number>(0);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperCore | null>(null);

  // Initialize Swiper modules with useEffect
  useEffect(() => {
    if (thumbSwiper) {
      thumbSwiper.on("slideChange", () => {
        setActiveThumbIndex(thumbSwiper.activeIndex);
      });
    }
  }, [thumbSwiper]);

  return (
    <div className={`media_screen ${styles.media_screen}`}>
      <div className="media_viewer">
        {mpProductLabel?.label_image ? (
          <figure className="product_label">
            <Image
              src={`${mpProductLabel.label_image}`}
              alt="label"
              width={90}
              height={30}
            />
          </figure>
        ) : null}
        {mediaList.length ? (
          currentMedia?.media_type === "image" ? (
            <ImageHolder />
          ) : (
            <VideoHolder />
          )
        ) : (
          <ImageHolder />
        )}
      </div>
      {mediaList.length ? (
        <div className="media_thumbs">
          <Swiper
            modules={[Navigation, Scrollbar, A11y]}
            onSwiper={setThumbSwiper}
            spaceBetween={25}
            slidesPerView={winWidth && winWidth < 767 ? 3 : 4}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            // direction={winWidth && winWidth <= 991 ? "vertical": "horizontal"}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
            watchSlidesProgress
            className="thumbnail-slider"
          >
            {mediaList.map((media, index) => (
              <SwiperSlide
                key={index}
                onClick={() => {
                  setCurrentMedia(media);
                  setActiveThumbIndex(index);
                }}
                className={index === activeThumbIndex ? "active" : ""}
              >
                <div className="thum_holder">
                  {media.media_type !== "image" ? (
                    <VideoPause className="icon" />
                  ) : null}
                  <Image
                    src={media.thumbnail || ""}
                    alt={`Thumbnail ${index}`}
                    width={150}
                    height={120}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={`${styles.navigation} swiper-button-prev`} />
          <div className={`${styles.navigation} swiper-button-next`} />
          <div className={`${styles.scrollbar} swiper-scrollbar`} />
        </div>
      ) : null}
    </div>
  );
}

export default MediaScreen;
