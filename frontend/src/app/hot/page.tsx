export const dynamic = "force-dynamic";

import GET_CMS_BLOCKS, {
  GetCmsBlocksType,
} from "@/features/hot/apollo/queries";
// import HotPageClient from "@/features/hot/screens/HotPageClient";
import { CmsBlock } from "@/generated/types";
import { getClient } from "@/lib/apollo/client";
import styles from "../../features/hot/styles/styles.module.scss";
import React from "react";
import dynamicImport from "next/dynamic";

const HotPageClient = dynamicImport(
  () => import("@/features/hot/screens/HotPageClient"),
  { ssr: false }
);

async function Hotpage() {
  const client = getClient();
  const hotContents = await client
    .query<GetCmsBlocksType["Response"], GetCmsBlocksType["Variables"]>({
      query: GET_CMS_BLOCKS,
      variables: {
        identifiers: ["bespoke_luxury_lurniture", "house_of_timber"],
      },
      fetchPolicy: "no-cache",
    })
    .catch((err) => {
      throw err;
    });

  const hotTextContents = hotContents.data.cmsBlocks.items?.[0];
  const hotImageContents = hotContents.data.cmsBlocks.items?.[1];

  // console.log("hotTextContents", hotTextContents);

  if (!hotContents.data.cmsBlocks.items?.length) return null;

  return (
    <div className={`hot_page ${styles.hot_page}`}>
      <div className="banner">
        <div className="container">
          <h1 className="text-h1">House of Timber</h1>
        </div>
      </div>
      <HotPageClient
        hotImageContents={hotImageContents as CmsBlock}
        hotTextContents={hotTextContents as CmsBlock}
      />
    </div>
  );
}

export default Hotpage;
