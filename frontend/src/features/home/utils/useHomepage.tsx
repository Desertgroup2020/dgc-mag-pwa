import { LinkItems, Maybe } from "@/generated/types";
import React from "react";

function useHomepage() {
  const getBlockRedirectLink = (linkInfo: Maybe<LinkItems>) => {
    if (
      linkInfo?.link_url ||
      (linkInfo?.external_url && linkInfo.external_url !== "")
    ) {
      if (linkInfo?.link_type === "default") {
        return linkInfo?.external_url;
      } else if (linkInfo?.link_type === "product") {
        return `/${linkInfo?.link_url}.html`;
      } else {
        return `/${linkInfo?.link_url}`;
      }
    } else {
      return `/#`;
    }
  };

  return {
    getBlockRedirectLink
  };
}

export default useHomepage;
