import { Review } from "@/generated/types";
import React, { useState } from "react";
import useReview from "../../hooks/useReview";
import RatingStars from "./RatingStars";
import styles from "../../styles/style.module.scss";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/reusable-uis/Modal";

function ReviewImage({ image }: { image: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_ENDPOINT;

  // states
  const [imageOpen, setImageOpen] = useState(false);

  // features
  const handleImageOpen = ()=> setImageOpen(prev=>!prev);

  return (
    <>
      <div className="review_image" onClick={handleImageOpen} style={{cursor: "pointer"}}>
        <Image
          src={`${baseUrl}/${image}`}
          alt="Review Image"
          width={80}
          height={60}
        />
      </div>
      <Modal
        className="review_image_modal"
        isOpen={imageOpen}
        setIsOpen={handleImageOpen}
      >
        <div className="review_image">
          <Image
            src={`${baseUrl}/${image}`}
            alt="Review Image"
            width={650}
            height={600}
            style={{
              width: "100%",
              height: "auto"
            }}
          />
        </div>
      </Modal>
    </>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const {
    nickname,
    ratingOptionId,
    createdAt,
    title,
    reviewText,
    reviewedImages,
  } = useReview({ review });

  return (
    <div className={`review_card ${styles.review_card}`}>
      <div className="left">
        <div className="profile">
          <h3 className="name">{nickname}</h3>
          <span className="doc">{createdAt}</span>
        </div>
      </div>
      <div className="right">
        <div className="content">
          <h2>{title}</h2>
          <RatingStars optionId={ratingOptionId!} />
          <p>{reviewText}</p>
          <div className="images">
            <ul>
              {reviewedImages?.map((imageItem, i) => (
                <li key={i}>
                  {/* <figure> */}
                  <ReviewImage image={imageItem?.full_path || ""} />

                  {/* </figure> */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
