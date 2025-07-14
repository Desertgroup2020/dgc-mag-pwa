import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductInterface } from "@/generated/types";
import React, { useState } from "react";
import styles from "../styles/style.module.scss";
import dynamic from "next/dynamic";
import { CmsLoader } from "../components/DetailTabCmsBlock";
import { DetailsTabReviewSkelton } from "./DetailsTabReview";
import useProduct from "@/components/product/useProduct";
// import DetailsTabReview from "./DetailsTabReview";
// import DetailTabCmsBlock from "./DetailTabCmsBlock";

const DetailTabCmsBlock = dynamic(
  () => import("../components/DetailTabCmsBlock"),
  {
    loading: () => <CmsLoader />,
  }
);
const DetailsTabReview = dynamic(() => import("./DetailsTabReview"), {
  loading: () => <DetailsTabReviewSkelton />,
});

interface DetailTabsProps {
  product: ProductInterface;
}
type TabType = "DETAIL" | "DIMENSION" | "SHIPPING_DELIVERY" | "REVIEW";
function DetailTabs({ product }: DetailTabsProps) {
  const {descriptionHtml, reviewCount} = useProduct({product});

  const [currentTab, setCurrentTab] = useState<TabType>(()=>{
    if(!!descriptionHtml){
      return "DETAIL"
    }    

    return "SHIPPING_DELIVERY"
  });

  return (
    <div className={`details_tabs_section ${styles.details_tabs_section}`}>
      <div className="container">
        <Tabs value={currentTab} defaultValue={currentTab} className="pdp_tabs">
          <TabsList className="tab_trigger_list">
            {!!descriptionHtml ? (
              <TabsTrigger
                value="DETAIL"
                className="tab_trigger_item"
                onClick={() => setCurrentTab("DETAIL")}
              >
                <span>PRODUCT DETAILS</span>
              </TabsTrigger>
            ) : null}

            {/* <TabsTrigger
              value="DIMENSION"
              onClick={() => setCurrentTab("DIMENSION")}
              className="tab_trigger_item"
            >
              <span>DIMENSION</span>
            </TabsTrigger> */}
            <TabsTrigger
              value="SHIPPING_DELIVERY"
              onClick={() => setCurrentTab("SHIPPING_DELIVERY")}
              className="tab_trigger_item"
            >
              <span>SHIPPING & DELIVERY</span>
            </TabsTrigger>
            <TabsTrigger
              value="REVIEW"
              onClick={() => setCurrentTab("REVIEW")}
              className="tab_trigger_item"
            >
              <span>REVIEWS ({reviewCount})</span>
            </TabsTrigger>
          </TabsList>
          {!!descriptionHtml ? (
            <TabsContent value="DETAIL" className="tab_content">
              <div className="detail_tab">
                <div
                  dangerouslySetInnerHTML={{
                    __html: descriptionHtml || "",
                  }}
                ></div>
              </div>
            </TabsContent>
          ) : null}

          {/* <TabsContent value="DIMENSION" className="tab_content">
            <div className="detail_tab">
              <div
                dangerouslySetInnerHTML={{
                  __html: product.description?.html || "",
                }}
              ></div>
            </div>
          </TabsContent> */}
          <TabsContent value="SHIPPING_DELIVERY" className="tab_content">
            <DetailTabCmsBlock />
          </TabsContent>
          <TabsContent value="REVIEW" className="tab_content">
            <DetailsTabReview product={product} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DetailTabs;
