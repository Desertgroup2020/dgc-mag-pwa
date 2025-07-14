"use client"

import makeClient from "@/lib/apollo/apolloProvider";
import { useAppDispatch } from "@/redux/hooks";
import React, { useEffect } from "react";
import { fetchStoreConfig } from "../slice/storeConfig";

function StoreConfigIntialize() {
  const client = makeClient();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchStoreConfig(client));
  }, [client, dispatch]);

  return null;
}

export default StoreConfigIntialize;
