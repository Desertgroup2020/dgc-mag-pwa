import { configureStore } from "@reduxjs/toolkit";
import windowSlice from "./window/windowSlice";
import authSlice from "../features/authentication/slice/auth";
import cartSlice from "../features/cart/slice/cart";
import wishlist from '../features/wishlist/slice/wishlist';
import storeConfig from '../features/store-config/slice/storeConfig';

export const makeStore = () => {
  return configureStore({
    reducer: {
      window: windowSlice,
      auth: authSlice,
      cart: cartSlice,
      wishlist,
      storeConfig
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
