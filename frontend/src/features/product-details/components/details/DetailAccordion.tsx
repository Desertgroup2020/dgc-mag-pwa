import useProduct from "@/components/product/useProduct";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductInterface } from "@/generated/types";
import styles from "../../styles/style.module.scss";
import React from "react";
// import DetailTabCmsBlock from "../DetailTabCmsBlock";
// import DetailsTabReview from "../DetailsTabReview";
import dynamic from "next/dynamic";
import { CmsLoader } from "../DetailTabCmsBlock";
import { DetailsTabReviewSkelton } from "../DetailsTabReview";

const DetailTabCmsBlock = dynamic(() => import("../DetailTabCmsBlock"), {
  loading: () => <CmsLoader />,
});
const DetailsTabReview = dynamic(() => import("../DetailsTabReview"), {
  loading: () => <DetailsTabReviewSkelton />,
});

interface DetailAccordionProps {
  product: ProductInterface;
}
function DetailAccordion({ product }: DetailAccordionProps) {
  const { descriptionHtml, reviewCount } = useProduct({ product });

  return (
    <div className={`detail_accordion ${styles.detail_accordion}`}>
      <div className="container">
        <Accordion
          type="single"
          collapsible
          defaultValue={!!descriptionHtml ? "item-1" : "item-2"}
        >
          {!!descriptionHtml ? (
            <AccordionItem value="item-1" className="acc_item">
              <AccordionTrigger className="heading">
                PRODUCT DETAILS
              </AccordionTrigger>
              <AccordionContent>
                <div className="detail_tab">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: descriptionHtml || "",
                    }}
                  ></div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null}

          <AccordionItem value="item-2" className="acc_item">
            <AccordionTrigger className="heading">
              SHIPPING & DELIVERY
            </AccordionTrigger>
            <AccordionContent className="cms_content">
              <DetailTabCmsBlock />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="acc_item">
            <AccordionTrigger className="heading">
              REVIEWS ({reviewCount})
            </AccordionTrigger>
            <AccordionContent>
              <DetailsTabReview product={product} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default DetailAccordion;
