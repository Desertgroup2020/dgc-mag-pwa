import { Customer, CustomerAddress } from "@/generated/types";
import { ApolloClient } from "@apollo/client";
import {
  createAsyncThunk,
  createSlice,
  current,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { CUSTOMER_QUERY, CustomerQueryType } from "../apollo/queries";
import Cookies from "js-cookie";
import { RootState } from "@/redux/store";

interface AuthState {
  token: string | null;
  value: Customer | null;
  status: "idle" | "loading" | "failed";
  error: SerializedError | null;
  customerCartId: string | null
}
type DeleteCustomerAdress = number | undefined;
type FetchCustomerProps = {
  client?: ApolloClient<object>;
  onSuccess?: (customerData: CustomerQueryType["Response"]) => void;
  onFailure?: (error: Error) => void;
};

const token = typeof window !== undefined ? Cookies.get("token") || null : null;
const initialState = {
  token,
  error: null,
  status: "loading",
  value: null,
} as AuthState;

export const fetchCustomer = createAsyncThunk(
  "auth/fetchUser",
  async ({ client, onFailure, onSuccess }: FetchCustomerProps) => {
    try {
      const data = await client?.query<CustomerQueryType["Response"]>({
        query: CUSTOMER_QUERY,
        fetchPolicy: "no-cache"
      });

      onSuccess?.(data?.data as CustomerQueryType["Response"]);
      return data?.data as CustomerQueryType["Response"];
    } catch (error) {
      if (error instanceof Error) {
        onFailure?.(error);
      }
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.value = action.payload;
    },
    addCustomerAddress: (state, action: PayloadAction<CustomerAddress>) => {
      state.value?.addresses?.push(action.payload);
    },
    updateCustomerAddress: (state, action: PayloadAction<CustomerAddress>) => {
      const addressIndex =
        state.value?.addresses?.findIndex(
          (item) => item?.id === action.payload.id
        ) ||
        (state.value?.addresses?.findIndex(
          (item) => item?.id === action.payload.id
        ) === 0
          ? 0
          : null);

      if (state.value?.addresses && addressIndex !== null) {
        state.value.addresses.splice(addressIndex, 1, action.payload);
      }
    },
    deleteCustomerAddressesStore: (
      state,
      action: PayloadAction<DeleteCustomerAdress>
    ) => {
      const newAddress = [...(current(state.value?.addresses) || [])];
      const index = newAddress.findIndex((a) => a?.id === action.payload);
      if (index !== -1) {
        state.value?.addresses?.splice(index, 1);
      }
    },
    updateToken: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        // console.log("token cookie seted");

        Cookies.set("token", action.payload);
      } else {
        Cookies.remove("token");
        // console.log("token cookie removed");
      }
      state.token = action.payload;
    },
    logout: (state) => {
      // console.log("logout called");

      Cookies.remove("token");
      state.token = null;
      state.value = null;
      state.customerCartId = null;
    },
    updateCustomerCartId: (state,action: PayloadAction<string | null>)=>{
      state.customerCartId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.value = action.payload.customer;
        state.customerCartId = action.payload.customerCart.id;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { updateToken, logout, updateCustomer, addCustomerAddress, deleteCustomerAddressesStore, updateCustomerAddress, updateCustomerCartId } = authSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
