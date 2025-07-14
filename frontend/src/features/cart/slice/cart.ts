import { Cart } from "@/generated/types";
import Cookies from "js-cookie";
import { ApolloClient } from "@apollo/client";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import GET_CART, { getCartQueryType } from "../apollo/queries/getCart";

interface FetchCartType {
  cartId: string;
  client?: ApolloClient<object>;
  onSuccess?: (cutomerCart: Cart | null) => void;
  onFailure?: (error: Error) => void;
}

const cartId = Cookies.get("cart-id") || null;

const initialState = {
  data: {
    cartId,
    cart: null as Cart | null,
  },
  error: null as null | SerializedError,
  status: "idle" as "idle" | "loading" | "failed",
  updatingCart: false,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ cartId, client, onFailure, onSuccess }: FetchCartType) => {
    try {
      const response = client?.query<
        getCartQueryType["Response"],
        getCartQueryType["Variables"]
      >({
        query: GET_CART,
        variables: {
          cart_id: cartId,
        },
        fetchPolicy: "no-cache"
      });
      const cart = (await response)?.data.cart;

      if (cart) {
        onSuccess?.(cart as Cart);
      }
      return cart;
    } catch (error) {
      onFailure?.(error as Error);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCart(state, action: PayloadAction<Cart | null>) {
      const newId = action.payload?.id;
      if (newId) {
        Cookies.set("cart-id", newId);
      } else {
        Cookies.remove("cart-id");
      }
      state.data.cartId = newId || null;
      state.data.cart = action.payload;
    },
    updateCartId(state, action: PayloadAction<{ id: string | null }>) {
      if (action.payload.id) {
        Cookies.set("cart-id", action.payload.id);
        state.data.cartId = action.payload.id;
      } else {
        Cookies.remove("cart-id");
        state.data.cartId = null;
      }
    },
    setUpdatingCart(state, action: PayloadAction<boolean>) {
      state.updatingCart = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "idle";

        // console.log("cart from fetch", action.payload.data.cart);

        if (action.payload) {
          const newId = action.payload.id || null;
          if (newId) {
            Cookies.set("cart-id", newId);
          } else {
            Cookies.remove("cart-id");
          }
          state.data = {
            cart: action.payload,
            cartId: newId,
          };
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
        Cookies.remove("cart-id");
        state.data.cart = null;
        state.data.cartId = null;
      });
  },
});

export const { setUpdatingCart, updateCart, updateCartId } = cartSlice.actions;

export default cartSlice.reducer;
