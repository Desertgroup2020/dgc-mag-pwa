"use client";

import React, { useState } from "react";
import styles from "../styles/style.module.scss";
import { Input } from "@/components/ui/input";
import ClickableRatingStars from "@/components/form-components/ClickableRatingStars";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import useAuth from "@/features/authentication/hooks/useAuth";
import Modal from "@/components/reusable-uis/Modal";
import Smile from "@/components/icons/Smile";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrderFeedbackProps = {
  orderId: number;
};
function OrderFeedback({ orderId }: OrderFeedbackProps) {
  // hooks
  const {
    postOrderFeedback: [postOrderFeedback, postOrderFeedbackStatus],
  } = useAuth();
  const formik = useFormik({
    initialValues: {
      rating: 0, // Initial rating value
      description: "",
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, "Please provide a rating.")
        .required("Rating is required."),
      description: Yup.string()
        .min(10, "Description must be at least 10 characters long.")
        .max(500, "Description cannot exceed 500 characters.")
        .required("Description is required."),
    }),
    onSubmit: (values) => {
      // console.log("Form Submitted:", values);
      // Perform your submit logic here
      if (orderId) {
        postOrderFeedback({
          variables: {
            input: {
              description: values.description,
              rating: values.rating,
              order_id: orderId,
            },
          },
          onCompleted(data, clientOptions) {
            if (data.postCustomerFeedback.success) {
              setUnsubscribedMsg(data.postCustomerFeedback.message || "Submited the feedback!");
              setUnsubscribed(true);
            }
          },
        });
      }
    },
  });
  const router = useRouter();

  //   states
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [unsubscribedMsg, setUnsubscribedMsg] = useState("");

  // features
  const handleRate = (rating: { option_id: number; ratingId: number }) => {
    const { option_id, ratingId } = rating;

    if (ratingId) {
      formik.setFieldValue("rating", ratingId);
    }
  };

  const handleModalOpen = () => {
    setUnsubscribed((prev) => {
      if (prev) {
        router.replace("/");
      }
      return !prev;
    });
  };

  return (
    <div className={`order_feedback ${styles.order_feedback}`}>
      <div className="container">
        <div className="feed_back_form">
          <form onSubmit={formik.handleSubmit}>
            {/* Rating Input */}
            <div className="input_grup">
              <label htmlFor="rating">Rating</label>
              <ClickableRatingStars onRate={handleRate} />
              {formik.touched.rating && formik.errors.rating ? (
                <div className="error">{formik.errors.rating}</div>
              ) : null}
            </div>

            {/* Description Input */}
            <div className="input_grup">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Order description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.description && formik.errors.description
                    ? "input-error"
                    : ""
                }
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="error">{formik.errors.description}</div>
              ) : null}
            </div>

            {/* Submit Button */}
            <div className="input_grup">
              <Button
                type="submit"
                variant={"itself"}
                className="w-full submit_btn text-pcard_price normal_btn"
                disabled={postOrderFeedbackStatus.loading}
              >
                {postOrderFeedbackStatus.loading ? (
                  <LoaderCircle className="animate-spin" />
                ) : null}
                <span>POST</span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* order success modal */}
      <Modal
        isOpen={unsubscribed}
        setIsOpen={handleModalOpen}
        notCloseOnOutside={true}
        className="order_complete_modal"
      >
        <div className={`common_success_content`}>
          <div className="inner">
            <Smile />
            <h2 className="text-h2">{unsubscribedMsg}</h2>
            <Link
              href={"/"}
              onClick={(e) => {
                e.preventDefault();
                router.replace("/");
              }}
              className="continue"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default OrderFeedback;
