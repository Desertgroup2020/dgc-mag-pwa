"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useCallback, useMemo, useState } from "react";
import useCartMutations from "./useCartMutations";
import {
  BundleProductCartItemInput,
  Cart,
  CartItemInput,
  CartItemUpdateInput,
  ProductInterface,
  RemoveItemFromCartInput,
} from "@/generated/types";
import { updateCart } from "../slice/cart";
import { useToast } from "@/components/ui/use-toast";
import {
  CUSTOMER_CART,
  CustomerCartType,
} from "@/features/authentication/apollo/queries";
import makeClient from "@/lib/apollo/apolloProvider";
import useGtm from "@/features/google-tag/hooks/useGtm";

function useCart() {
  // hooks
  const cart = useAppSelector((state) => state.cart.data.cart);
  const token = useAppSelector((state) => state.auth.token);
  const client = makeClient();
  const {
    updateCartItems: [updateCartItems, updateCartItemsStatus],
    removeItemFromCart: [removeItemFromCart, removeItemFromCartStatus],
    createGuestCart: [createGuestCart, createGuestCartStatus],
    addProductsToCart: [addProductsToCart, addProductsToCartStatus],
    addBundleProductsToCart: [
      addBundleProductToCart,
      addBundleProductToCartStatus,
    ],
  } = useCartMutations();
  const { gtagAddToCartEvent } = useGtm();
  const dispatch = useAppDispatch();
  const { toast, dismiss } = useToast();

  // constants
  const cartItemsAllCrosssellProducts = useMemo(() => {
    return (
      cart?.itemsV2?.items?.reduce<ProductInterface[]>((acc, item) => {
        if (item?.product?.crosssell_products) {
          const validProducts = item.product.crosssell_products.filter(
            (product): product is ProductInterface => Boolean(product) // Type guard
          );
          return [...acc, ...validProducts];
        }
        return acc;
      }, []) || []
    );
  }, [cart]);
  // states
  const cartItems = useMemo(() => cart?.itemsV2, [cart]);
  const [addingToCart, setAddingToCart] = useState(false);

  // features
  const handleUpdateCartItems = useCallback(
    ({
      cartId,
      cart_items,
      completed,
      error,
    }: {
      cartId: string;
      cart_items: CartItemUpdateInput[];
      completed?: (cart: Cart) => void;
      error: () => void;
    }) => {
      updateCartItems({
        variables: {
          input: {
            cart_id: cartId,
            cart_items,
          },
        },
        onCompleted(data, clientOptions) {
          if (data.updateCartItems.cart) {
            dispatch(updateCart(data.updateCartItems.cart));
            completed?.(data.updateCartItems.cart);
          }
        },
        onError() {
          error();
        },
      });
    },
    [dispatch, updateCartItems]
  );
  const handleRemoveCartItems = useCallback(
    ({
      input,
      onRemove,
    }: {
      input: RemoveItemFromCartInput;
      onRemove?: () => void;
    }) => {
      if (input.cart_id && input.cart_item_uid) {
        removeItemFromCart({
          variables: {
            input,
          },
          onCompleted(data, clientOptions) {
            if (data.removeItemFromCart.cart) {
              dispatch(updateCart(data.removeItemFromCart.cart));
              onRemove?.();
            }
          },
        });
      }
    },
    [dispatch, removeItemFromCart]
  );
  const handleAddToCart = useCallback(
    ({
      name,
      cartItems,
    }: {
      name: string;
      cartItems: CartItemInput[];
      onAddToCart?: () => void;
      onAddToCartError?: () => void;
    }) => {
      setAddingToCart(true);
      if (!cart) {
        if (token) {
          client
            .query<CustomerCartType["Response"]>({ query: CUSTOMER_CART })
            .then(({ data, errors }) => {
              if (data.customerCart) {
                addProductsToCart({
                  variables: {
                    cartId: data.customerCart.id,
                    cartItems,
                  },
                  onCompleted(data, clientOptions) {
                    if (
                      data.addProductsToCart.cart &&
                      !data.addProductsToCart.user_errors.length
                    ) {
                      // add to cart event
                      gtagAddToCartEvent({ cart: data.addProductsToCart.cart });
                      dispatch(updateCart(data.addProductsToCart.cart));
                      toast({
                        variant: "success",
                        title: "Add to cart",
                        description: `You have successfuly added ${name} to your shopping cart`,
                      });
                    }
                    if (data.addProductsToCart.user_errors.length) {
                      const currentError =
                        data.addProductsToCart.user_errors?.[0];
                      toast({
                        variant: "error",
                        title: "Add to cart",
                        description: `${
                          currentError?.message || "Ooops something went wrong"
                        }`,
                      });
                    }
                  },
                }).finally(() => setAddingToCart(false));
              }
            })
            .catch((err) => {
              toast({
                variant: "error",
                title: "Add to cart",
                description: err || "Ooops something went wrong",
              });
            });
        } else {
          createGuestCart({
            onCompleted(data, clientOptions) {
              if (data.createGuestCart.cart) {
                addProductsToCart({
                  variables: {
                    cartId: data.createGuestCart.cart.id,
                    cartItems,
                  },
                  onCompleted(data, clientOptions) {
                    if (
                      data.addProductsToCart.cart &&
                      !data.addProductsToCart.user_errors.length
                    ) {
                      gtagAddToCartEvent({ cart: data.addProductsToCart.cart });
                      dispatch(updateCart(data.addProductsToCart.cart));
                      toast({
                        variant: "success",
                        title: "Add to cart",
                        description: `You have successfuly added ${name} to your shopping cart`,
                      });
                    }
                    if (data.addProductsToCart.user_errors.length) {
                      const currentError =
                        data.addProductsToCart.user_errors?.[0];
                      toast({
                        variant: "error",
                        title: "Add to cart",
                        description: `${
                          currentError?.message || "Ooops something went wrong"
                        }`,
                      });
                    }
                  },
                }).finally(() => setAddingToCart(false));
              }
            },
          });
        }
      } else {
        addProductsToCart({
          variables: {
            cartId: cart.id,
            cartItems,
          },
          onCompleted(data, clientOptions) {
            if (
              !data.addProductsToCart.user_errors.length &&
              data.addProductsToCart.cart
            ) {
              gtagAddToCartEvent({ cart: data.addProductsToCart.cart });
              dispatch(updateCart(data.addProductsToCart.cart));
              toast({
                variant: "success",
                title: "Add to cart",
                description: `You have successfuly added ${name} to your shopping cart`,
              });
            } else if (data.addProductsToCart.user_errors.length) {
              toast({
                variant: "error",
                title: "Add to cart",
                description:
                  data.addProductsToCart.user_errors?.[0]?.message ||
                  "Ooops something went wrong",
              });
            }
          },
        }).finally(() => setAddingToCart(false));
      }
    },
    [cart, createGuestCart, addProductsToCart, dispatch, toast]
  );
  const handleBundleAddToCart = useCallback(
    ({
      cartItems,
      name
    }: {
      name: string;
      cartItems: BundleProductCartItemInput[];
      onAddToCart?: () => void;
      onAddToCartError?: () => void;
    }) => {
      setAddingToCart(true);
      if (!cart) {
        if (token) {
          client
            .query<CustomerCartType["Response"]>({ query: CUSTOMER_CART })
            .then(({ data, errors }) => {
              if (data.customerCart) {
                addBundleProductToCart({
                  variables: {
                    input: {
                      cart_id: data.customerCart.id,
                      cart_items: cartItems,
                    },
                  },
                  onCompleted(data, clientOptions) {
                    if (
                      data.addBundleProductsToCart.cart                   
                    ) {
                      // add to cart event
                      gtagAddToCartEvent({ cart: data.addBundleProductsToCart.cart });
                      dispatch(updateCart(data.addBundleProductsToCart.cart));
                      toast({
                        variant: "success",
                        title: "Add to cart",
                        description: `You have successfuly added ${name} to your shopping cart`,
                      });
                    }                    
                  },
                }).finally(() => setAddingToCart(false));
              }
            })
            .catch((err) => {
              toast({
                variant: "error",
                title: "Add to cart",
                description: err || "Ooops something went wrong",
              });
            });
        } else {
          createGuestCart({
            onCompleted(data, clientOptions) {
              if (data.createGuestCart.cart) {
                addBundleProductToCart({
                  variables: {
                    input: {
                      cart_id: data.createGuestCart.cart.id,
                      cart_items: cartItems,
                    },
                  },
                  onCompleted(data, clientOptions) {
                    if (data.addBundleProductsToCart.cart) {
                      gtagAddToCartEvent({
                        cart: data.addBundleProductsToCart.cart,
                      });
                      dispatch(updateCart(data.addBundleProductsToCart.cart));
                      toast({
                        variant: "success",
                        title: "Add to cart",
                        description: `You have successfuly added ${name} to your shopping cart`,
                      });
                    }
                  },
                }).finally(() => setAddingToCart(false));
              }
            },
          });
        }
      } else {
        addBundleProductToCart({
          variables: {
            input: {
              cart_id: cart.id,
              cart_items: cartItems,
            },
          },
          onCompleted(data, clientOptions) {
            if (             
              data.addBundleProductsToCart.cart
            ) {
              gtagAddToCartEvent({ cart: data.addBundleProductsToCart.cart });
              dispatch(updateCart(data.addBundleProductsToCart.cart));
              toast({
                variant: "success",
                title: "Add to cart",
                description: `You have successfuly added ${name} to your shopping cart`,
              });
            }
          },
        }).finally(() => setAddingToCart(false));
      }
    },
    []
  );

  return {
    cartItems,
    handleUpdateCartItems,
    updateCartItemsStatus,
    handleRemoveCartItems,
    removeItemFromCartStatus,
    handleAddToCart,
    handleBundleAddToCart,
    addingToCart,
    cartItemsAllCrosssellProducts,
  };
}
export default useCart;
