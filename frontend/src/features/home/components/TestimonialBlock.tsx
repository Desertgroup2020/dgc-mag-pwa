import React from "react";
import { BlockProp } from "./SliderBlock";
import { getClient } from "@/lib/apollo/client";
import { TESTIMONIAL_BLOCK_QUERY, TestimonialBlockQuery } from "../apollo/queries";
import logger from "@/lib/logger";
import styles from '../styles/testimonial.module.scss';
import dynamic from "next/dynamic";

const TestimonialClient = dynamic(()=> import("./client/TestimonialClient"), {
  ssr: false,
})

async function TestimonialBlock({ blockId }: BlockProp) {
  const { data } = await getClient()
    .query<
      TestimonialBlockQuery["Response"],
      TestimonialBlockQuery["Variables"]
    >({
      query: TESTIMONIAL_BLOCK_QUERY,
      variables: {
        blockId: blockId,
      },
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  const refinedTestimonialBlock = data.getBlockData?.[0];
  if (!refinedTestimonialBlock.desktop_status) return null;
  return <div className={`testimonial ${styles.testimonial}`}>
    <div className="container">
        <h2 className=" text-h2 mb-h2_btm">Lets hear from customers</h2>
        <TestimonialClient testimonialBlock={refinedTestimonialBlock}/>
    </div>
  </div>;
}

export default TestimonialBlock;
