import { useErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import React from "react";
import {
  CREATE_WHOLESALER_ACCOUNT,
  CreateWholesalerAccountType,
} from "../apollo/mutations";

function useWholesaler() {
  const errorHandler = useErrorHandler();

  const createWholesaler = useMutation<
    CreateWholesalerAccountType["Response"],
    CreateWholesalerAccountType["Variables"]
  >(CREATE_WHOLESALER_ACCOUNT, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  return {
    createWholesaler
  };
}

export default useWholesaler;
