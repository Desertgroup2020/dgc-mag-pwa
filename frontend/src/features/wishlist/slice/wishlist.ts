import { ApolloClient } from "@apollo/client";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { Wishlist, Maybe, Id } from "@/generated/types";

import { RootState } from "@/redux/store";
import { GET_WISHLIST, WishlistQueryType } from "../apollo/queries";


const initialState = {
  data: null as Maybe<Wishlist>,
  status: "idle" as "idle" | "loading" | "failed",
  error: null as Maybe<SerializedError>,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (options: { client: ApolloClient<object>; wishlistId: string }) => {
    const res = await options.client.query<
      WishlistQueryType["Response"],
      WishlistQueryType["Variables"]
    >({
      query: GET_WISHLIST,
      variables: {
        id : options.wishlistId 
        
      },
      fetchPolicy: "no-cache"
    });
    return res.data.customer.wishlist_v2 || null;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    updateWishlist(state, action: PayloadAction<Maybe<Wishlist>>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});
export const selectAuth = (state: RootState) => state.auth.value;

export const { updateWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
