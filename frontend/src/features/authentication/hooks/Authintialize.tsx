"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { fetchCustomer, updateCustomer, updateToken } from "../slice/auth";
import { useSearchParams } from "next/navigation";
import { CHECK_TOKEN_AVAILABILITY } from "../apollo/queries";
import { ApolloError } from "@apollo/client";
import { updateRouteChanging } from "@/redux/window/windowSlice";
import makeClient from "@/lib/apollo/apolloProvider";
import { updateCart } from "@/features/cart/slice/cart";
import { useToast } from "@/components/ui/use-toast";
import { clearLocalStorage, useBlocking } from "../components/blockingContext";
import useCustomer from "./useCustomer";

type CheckTokenAvailabilityProps = {
  onSuccess?: (token: string) => void;
  onFailure?: (error: Error) => void;
};
const checkTokenAvailability = async ({
  onFailure,
  onSuccess,
}: CheckTokenAvailabilityProps) => {
  try {
    const graphqlPayload = {
      query: CHECK_TOKEN_AVAILABILITY?.loc?.source.body,
    };
    const response = await makeClient().query({
      query: CHECK_TOKEN_AVAILABILITY,
    });

    onSuccess?.(response.data.customer.token);

    return response.data.customer.token;
  } catch (err) {
    if (err instanceof Error) {
      onFailure?.(err);
    }
    return err;
  }
};

function Authintialize() {
  const dispatch = useAppDispatch();
  const {token} = useAppSelector((state)=>state.auth)
  const {toast} = useToast();
  const {handleLogOut} = useCustomer();
  // const token =
  //   typeof window !== "undefined" ? Cookies.get("token") || null : null;
  const client = makeClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!!token) {
      dispatch(
        fetchCustomer({
          client,
          onFailure(error) {
            // console.log("fetch customer error", error);
            dispatch(updateToken(null));
            toast({
              title: "User Registration",
              description:
                error.message ||
                "User created succesfully",
              variant: "error",
            });
          },
          onSuccess(customerData) {
            // console.log('customer data', customerData);
            if (customerData) {
              dispatch(updateCustomer(customerData.customer));
            }
          },
        })
      );
    }
  }, [token]);

  useEffect(() => {
    if (!!token)
      checkTokenAvailability({
        onSuccess(token) {
          // console.log("session not expired...");
        },
        onFailure(error) {
          handleLogOut();
          if (error instanceof ApolloError) {
            // onError(error);
          }
        },
      });
  }, []);
  useEffect(() => {
    if (!!token)
      checkTokenAvailability({
        onSuccess(token) {
          // console.log("session not expired...");
        },
        onFailure(error) {
          handleLogOut();
          if (error instanceof ApolloError) {
            // onError(error);
          }
        },
      });
  }, [searchParams]);

  useEffect(()=>{
    if(searchParams){
      dispatch(updateRouteChanging(false));
    }
  }, [searchParams])

  return null;
}

export default Authintialize;
