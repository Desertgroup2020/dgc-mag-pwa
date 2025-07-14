import UnSubscribeClient from "@/features/unsubscribe/UnSubscribeClient";
import React from "react";
import { KeyValuePair } from "../[...slug]/page";
import { notFound } from "next/navigation";

function UnsubscribePage({ searchParams }: { searchParams: KeyValuePair }) {
  const productId = searchParams.productId as string;
  const type = searchParams.type as string;
  const loggedOutScenario = searchParams.signin as string;

  // if (!type && !loggedOutScenario) notFound();
  return <UnSubscribeClient type={type} productId={productId} />;
}

export default UnsubscribePage;
