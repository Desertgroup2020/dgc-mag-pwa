import { BANNER_BLOCK, BannerBlockQuery } from "@/features/home/apollo/queries";
import { getClient } from "@/lib/apollo/client";
import logger from "@/lib/logger";
import Image from "next/image";
import React from "react";

const StaticBlock = async () => {
  const { data } = await getClient()
    .query<BannerBlockQuery["Response"], BannerBlockQuery["Variables"]>({
      query: BANNER_BLOCK,
      variables: {
        blockId: 20,
      },
      fetchPolicy: "no-cache",
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });
  const refinedBannerBlock = data.getBlockData?.[0];

  return (
    <div className="container">
      <div className=" flex w-full gap-8 static_block_container">
        {refinedBannerBlock.banneritems?.map((banner, i) => (
          <div
            key={i}
            className={`flex items-center justify-start basis-1/3 shipping_container ${
              i !== (refinedBannerBlock.banneritems?.length || 3) - 1
                ? "border-r"
                : ""
            } border-gray-300`}
          >
            <div className="flex gap-3 block_wrapper_shipping items-center">
              <Image
                src={banner?.image || "/assets/images/freeship.png"}
                alt="free-shipping"
                width="40"
                height="40"
                className="object-contain"
              />
              <div className="flex flex-col text_wrapper">
                <span className="block_text">{banner?.title}</span>
                <span className="block_text_desc text-gray-400">
                  {banner?.subtitle}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* <div className="flex items-center justify-center personalize_container basis-1/3">
          <div className="flex gap-3 block_wrapper_personalize items-center">
            <Image
              src="/assets/images/personalize.png"
              alt="personalize"
              width="40"
              height="40"
              className="object-contain"
            />
            <div className="flex flex-col text_wrapper">
              <span className="block_text">Personalize your products</span>
              <span className="block_text_desc text-gray-400">
                Ability to cater to specific customer needs.
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end discount_container basis-1/3 border-l border-gray-300">
          <div className="flex gap-3 block_wrapper_discounts justify-end items-center">
            <Image
              src="/assets/images/offer.png"
              alt="special-offers"
              width="40"
              height="40"
              className="object-contain"
            />
            <div className="flex flex-col text_wrapper">
              <span className="block_text">Special offers and discounts</span>
              <span className="block_text_desc text-gray-400">
                Unlock discount items, attractive deals and promotions.
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default StaticBlock;
