"use client";

import React, { useEffect, useMemo } from "react";
import useCartMutations from "./useCartMutations";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCart, updateCart } from "../slice/cart";
import { useToast } from "@/components/ui/use-toast";
import makeClient from "@/lib/apollo/apolloProvider";
import { useErrorHandler } from "@/utils";
import { ApolloError } from "@apollo/client";

function CartIntialization() {
  // hooks
  const {
    mergeCarts: [mergeCarts, mergeCartsStatus],
  } = useCartMutations();
  const client = makeClient();
  const dispatch = useAppDispatch();
  const errorHandler = useErrorHandler();
  const { toast } = useToast();
  const cart = useAppSelector((state) => state.cart.data.cart);
  const customerCartId = useAppSelector(
    (state) => state.auth.customerCartId || null
  );
  const existingCartId = useAppSelector((state) => state.cart.data.cartId);
  // const gtm_add_to_cart: string | null = useMemo(() => {
  //   if (!cart?.gtm_add_to_cart) return null;

  //   // Match all <script>...</script> tags
  //   const scriptTags = cart.gtm_add_to_cart.match(
  //     /<script\b[^>]*>([\s\S]*?)<\/script>/gi
  //   );

  //   // Return the content of the last <script> tag
  //   if (scriptTags && scriptTags.length > 0) {
  //     const lastScriptTag = scriptTags[scriptTags.length - 1];
  //     const scriptContentMatch = lastScriptTag.match(
  //       /<script\b[^>]*>([\s\S]*?)<\/script>/i
  //     );
  //     return scriptContentMatch ? scriptContentMatch[1] : null;
  //   }

  //   return null;
  // }, [cart]);

  // console.log("existing cart id", existingCartId);
  

  useEffect(() => {
    if (customerCartId) {
      if (existingCartId) {
        if (existingCartId !== customerCartId) {
          mergeCarts({
            variables: {
              source_cart_id: existingCartId,
              destination_cart_id: customerCartId,
            },
            onCompleted(data, clientOptions) {
              if (data.mergeCarts) {
                dispatch(updateCart(data.mergeCarts));
              }
            },
          });
        } else {
          dispatch(
            fetchCart({
              cartId: existingCartId,
              client,
              onFailure(error) {
                errorHandler(error as ApolloError);
                // toast({
                //   variant: "error",
                //   title: "fetch cart",
                //   description: error.message || "",
                // });
              },
            })
          );
        }
      } else {
        dispatch(
          fetchCart({
            cartId: customerCartId,
            client,
            onFailure(error) {
              errorHandler(error as ApolloError);
              // toast({
              //   variant: "error",
              //   title: "fetch cart",
              //   description: error.message || "",
              // });
            },
          })
        );
      }
    } else if (existingCartId) {
      dispatch(
        fetchCart({
          cartId: existingCartId,
          client,
          onFailure(error) {
            errorHandler(error as ApolloError);
            // toast({
            //   variant: "error",
            //   title: "fetch cart",
            //   description: error.message || "",
            // });
          },
        })
      );
    }
  }, [customerCartId, dispatch, mergeCarts, toast]);

  // Dynamically add GTM script when gtm_add_to_cart changes
  // useEffect(() => {
  //   if (!gtm_add_to_cart) return;

  //   // Create a container to parse the code
  //   const container = document.createElement("div");
  //   container.innerHTML = gtm_add_to_cart;

  //   // Extract the script element
  //   const scriptElement = container.querySelector("script");
  //   if (scriptElement) {
  //     const dynamicScript = document.createElement("script");
  //     dynamicScript.innerHTML = scriptElement.innerHTML || "";
  //     dynamicScript.setAttribute("data-gtm", "add-to-cart");
  //     document.head.appendChild(dynamicScript);
  //   }

  //   // Cleanup previous script on change
  //   return () => {
  //     const existingScript = document.querySelector(
  //       "script[data-gtm='add-to-cart']"
  //     );
  //     if (existingScript) {
  //       existingScript.remove();
  //     }
  //   };
  // }, [gtm_add_to_cart]);

  return null;
}

export default CartIntialization;
