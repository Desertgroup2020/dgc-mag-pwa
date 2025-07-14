import CMS_BLOCK, {
  CmsBlockQueryType,
} from "@/features/dynamic-url/apollo/queries/cms_block";
import { PopUp } from "@/generated/types";
import { useErrorHandler } from "@/utils";
import { useQuery } from "@apollo/client";
import React from "react";

type ImagePopupProps = {
  popUp: PopUp;
  closePopup: () => void;
};
function CmsPopup({ closePopup, popUp }: ImagePopupProps) {
  // hooks
  const errorHandler = useErrorHandler();
  // data fetching
  const blockIdentifier = popUp.block_identifier;
  const { data, loading } = useQuery<
    CmsBlockQueryType["Response"],
    CmsBlockQueryType["Variables"]
  >(CMS_BLOCK, {
    variables: {
      identifiers: [`${blockIdentifier}`],
    },
    onCompleted(data) {},
    onError: errorHandler,
  });

  return (
    <div className="cms_pop_container">
      {loading ? (
        <span>Loading ...</span>
      ) : (
        data?.cmsBlocks.items?.map((item, i) => (
          <div className="cmsItem" key={i}>
            <h3 className="head text-h2 mb-1">{item?.title}</h3>
            <div
              className="txt"
              dangerouslySetInnerHTML={{ __html: item?.content || "" }}
            ></div>
          </div>
        ))
      )}
    </div>
  );
}

export default CmsPopup;
