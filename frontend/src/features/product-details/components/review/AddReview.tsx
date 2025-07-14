import { Input } from "@/components/ui/input";
import React, { useCallback, useEffect, useRef } from "react";
import ClickableRatingStars from "./ClickableRatingStars";
import { Button } from "@/components/ui/button";
import useReview, { AddReviewFormValues } from "../../hooks/useReview";
import { useFormik } from "formik";
import FileUploadButton from "@/components/reusable-uis/MultipleFileUploadButton";
import styles from "../../styles/style.module.scss";
import useDynamic from "@/features/dynamic-url/hooks/useDynamic";
import { ReviewData } from "@/generated/types";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function AddReview({
  productId,
  close,
}: {
  productId: number;
  close: () => void;
}) {
  // refs
  const parentRef = useRef<HTMLDivElement | null>(null);

  // hooks
  const { addReviewValidationSchema, addReviewInitialValues } = useReview({});
  const {
    addProductReview: [addProductReview, addProductReviewStatus],
  } = useDynamic();
  const { toast } = useToast();
  // state and forms
  const formik = useFormik<AddReviewFormValues>({
    initialValues: addReviewInitialValues,
    validationSchema: addReviewValidationSchema,
    onSubmit: (values) => {
      addProductReview({
        variables: {
          input: {
            title: values.title,
            detail: values.review,
            nickname: values.nickname,
            ratings: values.rating as string,
            product_id: productId,
            review_images: values.images as ReviewData[],
          },
        },
        onCompleted(data, clientOptions) {
          if (data.addAdvProductReview.success) {
            toast({
              title: "User Review",
              description: "Post has been submitted successfully",
              variant: "success",
            });
            close();
          }
        },
      });
    },
  });
  // functionalities
  const onRate = (rating: { option_id: number; ratingId: number }) => {
    // Destructure the rating object
    const { option_id, ratingId } = rating;

    // Create the object in the required format
    const formattedRating = {
      [ratingId]: option_id.toString(),
    };

    // Convert to JSON string for the backend
    const ratingString = JSON.stringify(formattedRating);

    // Log or use the ratingString to send to the backend
    // console.log("Formatted Rating:", ratingString);
    formik.setFieldValue("rating", ratingString);
  };
  const handleFileSelect = (
    files: {
      base64File: string | null;
      file_name: string;
    }[]
  ) => {
    // console.log("files from image selection", files);

    const images = formik.values.images ? [...formik.values.images] : [];

    files.forEach(({ base64File, file_name }) => {
      if (base64File && file_name) {
        images.push({ file_name, base64_data: base64File });
      }
    });

    formik.setFieldValue("images", images);
  };
  const handleFileRemove = (
    files: {
      base64File: string | null;
      file_name: string;
    }[]
  ) => {
    // console.log("files from image selection", files);

    const images = [] as any;

    files.forEach(({ base64File, file_name }) => {
      if (base64File && file_name) {
        images.push({ file_name, base64_data: base64File });
      }
    });

    formik.setFieldValue("images", images);
  };

  const scrolToTop = useCallback(() => {
    if (parentRef.current) {
      if (formik.errors?.["rating"] || formik.errors?.["nickname"]) {
        parentRef.current.scrollTop = 0;
      }
    }
  }, [formik.errors]);  

  // effects
  useEffect(()=>{
    scrolToTop();
  }, [formik.errors, scrolToTop])
  // errors
  // console.log("erros", formik.errors);

  return (
    <div className={`post_review ${styles.post_review}`} ref={parentRef}>
      <div className="review_form">
        <table border={1}></table>
        <form onSubmit={(e)=>{
          e.preventDefault();
          scrolToTop();
          formik.handleSubmit(e)
        }}>
          <div className="input_grup">
            <label htmlFor="rating">Rate</label>
            <ClickableRatingStars onRate={onRate} />
            {formik.errors.rating && formik.touched.rating && (
              <div className="error">{formik.errors.rating}</div>
            )}
          </div>
          <div className="row">
            <div className="input_grup col_one_half">
              <label htmlFor="nickname">Nickname</label>
              <Input
                type="text"
                name="nickname"
                placeholder="Django"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nickname}
                error={!!formik.errors.nickname && !!formik.touched.nickname}
                errorTxt={formik.errors.nickname}
              />
            </div>
            <div className="input_grup col_one_half">
              <label htmlFor="title">Summary</label>
              <Input
                type="text"
                name="title"
                placeholder="Nice Product!!"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                error={!!formik.errors.title && !!formik.touched.title}
                errorTxt={formik.errors.title}
              />
            </div>
          </div>
          <div className="input_grup">
            <label htmlFor="review">Review</label>
            <textarea
              name="review"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.review}
            ></textarea>
            {formik.errors.review && formik.touched.review && (
              <div className="error">{formik.errors.review}</div>
            )}
          </div>
          <div className="input_grup">
            <label htmlFor="images">Images</label>
            <FileUploadButton
              onFileSelect={handleFileSelect}
              handleFileRemove={handleFileRemove}
              // error={!!formik.errors.images && !!formik.touched.images}
              // errorTxt={formik.errors.images}
            />
            {formik.errors.images && formik.touched.images ? (
              <div className="error">
                {/* Check if errors.images is an array or a single error */}
                {Array.isArray(formik.errors.images)
                  ? formik.errors.images.length
                    ? formik.errors.images[0].toString() // Display the first error message if it's an array
                    : "No errors found"
                  : formik.errors.images}{" "}
                {/* Display the error directly if it's not an array */}
              </div>
            ) : null}
          </div>
          <div className="input_grup">
            <Button
              type="submit"
              variant={"itself"}
              className="w-full submit_btn text-pcard_price normal_btn"
              
              disabled={addProductReviewStatus.loading}
            >
              {addProductReviewStatus.loading ? (
                <LoaderCircle className="animate-spin" />
              ) : null}
              <span>POST</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddReview;
