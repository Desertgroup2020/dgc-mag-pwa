import { Review } from "@/generated/types";
import * as Yup from "yup";
import React, { useMemo } from "react";

export type AddReviewFormValues = {
  rating: string | null;
  nickname: string;
  title: string;
  review: string;
  images:
    | {
        file_name: string;
        base64_data: string;
      }[]
    | [];
};
function useReview({ review }: { review?: Review }) {
  const nickname = useMemo(() => review?.nickname, [review]);
  const reviewedImages = useMemo(() => review?.images, [review]);
  const comments = useMemo(() => review?.comments, [review]);
  const ratingOptionId = useMemo(
    () => review?.rating_votes?.[0]?.option_id,
    [review]
  );
  const createdAt = useMemo(()=> review?.created_at,[review]);
  const title = useMemo(()=> review?.title, [review]);
  const reviewText = useMemo(()=> review?.detail, [review])

  const SUPPORTED_FORMATS = ["image/jpeg", "image/png"];
  const extractMimeType = (base64String: string): string | null => {
    const match = base64String.match(/^data:(.*?);base64,/);
    return match ? match[1] : null;
  };
  const calculateFileSizeInMB = (base64String: string): number => {
    const stringLength = base64String.length - "data:image/png;base64,".length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    return sizeInBytes / (1024 * 1024); // convert bytes to MB
  };

  const addReviewInitialValues: AddReviewFormValues = {
    rating: null,
    nickname: "",
    title: "",
    review: "",
    images: [],
  };
  const addReviewValidationSchema = Yup.object().shape({
    rating: Yup.string().required("Rating is required"),
    nickname: Yup.string()
      .min(2, "Nickname must be at least 2 characters")
      .required("Nickname is required"),
    title: Yup.string()
      .min(5, "Title must be at least 5 characters")
      .required("Title is required"),
    review: Yup.string()
      .min(10, "Review must be at least 10 characters")
      .required("Review is required"),
    images: Yup.array()
      .of(
        Yup.object().shape({
          file_name: Yup.string().required("Filename is required"),
          base64_data: Yup.string()
            .required("Image data is required")
            .test("fileFormat", "Unsupported file format", (value: string) => {
              if (!value) return false;
              const mimeType = extractMimeType(value);
              return mimeType ? SUPPORTED_FORMATS.includes(mimeType) : false;
            }),
        })
      )
      .max(4, "Maximum 4 images are allowed!"),
  });

  return {
    nickname,
    reviewedImages,
    comments,
    ratingOptionId,
    createdAt,
    title,
    reviewText,
    addReviewInitialValues,
    addReviewValidationSchema,
  };
}

export default useReview;
