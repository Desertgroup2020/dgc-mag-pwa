import { useErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import React from "react";
import SET_PRODUCT_REPORT_MUTATION, {
  SetProductReportMutationType,
} from "../apollo/mutations/setProductViewReport";
import ADD_PRODUCT_REVIEW, {
  AddProductReviewType,
} from "../apollo/mutations/addProductReview";
import REQUEST_BULK_ORDER, {
  RequestBulkOrderType,
} from "../apollo/mutations/createBulkOrder";

function useDynamic() {
  const errorHandler = useErrorHandler();

  const setProductViewReport = useMutation<
    SetProductReportMutationType["Response"],
    SetProductReportMutationType["Variables"]
  >(SET_PRODUCT_REPORT_MUTATION, {
    onError: errorHandler,
  });

  const addProductReview = useMutation<
    AddProductReviewType["Response"],
    AddProductReviewType["Variables"]
  >(ADD_PRODUCT_REVIEW, {
    onError: errorHandler,
  });

  const requestBulkOrder = useMutation<
    RequestBulkOrderType["Response"],
    RequestBulkOrderType["Variables"]
  >(REQUEST_BULK_ORDER, {
    onError: errorHandler,
  });

  return {
    setProductViewReport,
    addProductReview,
    requestBulkOrder
  };
}

export default useDynamic;
