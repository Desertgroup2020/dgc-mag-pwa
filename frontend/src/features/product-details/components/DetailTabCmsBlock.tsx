import DetailsTabCmsSkeleton from "@/components/loader/productdisplay/DetailsTabCmsSkeleton";
import CMS_BLOCK, {
  CmsBlockQueryType,
} from "@/features/dynamic-url/apollo/queries/cms_block";
import { useErrorHandler } from "@/utils";
import { useQuery } from "@apollo/client";
import he from 'he'
import React from "react";

function DetailTabCmsBlock() {
  const errorHandler = useErrorHandler();
  const { data, loading } = useQuery<
    CmsBlockQueryType["Response"],
    CmsBlockQueryType["Variables"]
  >(CMS_BLOCK, {
    variables: {
      identifiers: ["delivery_charges"],
    },
    onCompleted(data) {},
    onError: errorHandler,
  });

  const content = he.decode(data?.cmsBlocks.items?.[0]?.content || "");

  if (loading) return <CmsLoader />;
  return (
    <div className="cms_contents" id="html-body">
      <div dangerouslySetInnerHTML={{ __html: content || "" }}></div>
    </div>
  );
}

export const CmsLoader = () => {
  return <DetailsTabCmsSkeleton/>;
};

export default DetailTabCmsBlock;
