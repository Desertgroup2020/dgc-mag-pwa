import GET_PRODUCT_REVIEWS, {
  GetProductReviewType,
} from "@/features/dynamic-url/apollo/queries/reviews/get_product_reviews";
import { ProductInterface, Review } from "@/generated/types";
import { useErrorHandler } from "@/utils";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import ReviewCard from "./review/ReviewCard";
import Modal from "@/components/reusable-uis/Modal";
// import AddReview from "./review/AddReview";
import { Button } from "@/components/ui/button";
import styles from "../styles/style.module.scss";
import dynamic from "next/dynamic";
import BulkOrderRequestSkeleton from "@/components/loader/productdisplay/BulkOrderRequestSkeleton";
import AddButtonSkeleton from "@/components/loader/productdisplay/AddButtonSkeleton";
import DetailsReviewSkeleton from "@/components/loader/productdisplay/DetailsReviewSkeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { handleSignInSheet } from "@/redux/window/windowSlice";

const AddReview = dynamic(() => import("./review/AddReview"), {
  ssr: false,
  loading: () => <BulkOrderRequestSkeleton />,
});

function DetailsTabReview({ product }: { product: ProductInterface }) {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const errorHandler = useErrorHandler();
  const { data, loading } = useQuery<
    GetProductReviewType["Response"],
    GetProductReviewType["Variables"]
  >(GET_PRODUCT_REVIEWS, {
    variables: {
      productId: product.id!,
      page: 1,
    },
    onError: errorHandler,
  });
  const reviewItems = data?.advreview.items;

  //   states
  const [openAddReviewModal, setOpenAddReviewModal] = useState(false);

  // features
  const handleOpenModal = () => {
    if (token) {
      setOpenAddReviewModal((prev) => !prev);
    }else{
      dispatch(handleSignInSheet(true));
    }
  };

  if (loading) return <DetailsTabReviewSkelton />;
  return (
    <div className={`details_tab_review_sec ${styles.details_tab_review_sec}`}>
      <div className="intro">
        <Button
          variant={"action_green"}
          className="normal_btn"
          onClick={handleOpenModal}
        >
          <span>Add Review</span>
        </Button>
      </div>
      {reviewItems?.length ? (
        <ul className="review_list">
          {reviewItems.map((review, i) => (
            <li key={i}>
              <ReviewCard review={review!} />
            </li>
          ))}
        </ul>
      ) : null}
      <Modal
        isOpen={openAddReviewModal}
        className="review_modal"
        setIsOpen={handleOpenModal}
      >
        <AddReview productId={product.id as number} close={handleOpenModal} />
      </Modal>
    </div>
  );
}

export const DetailsTabReviewSkelton = () => {
  return <DetailsReviewSkeleton />;
};

export default DetailsTabReview;
