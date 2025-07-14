import { CMS_PAGE_TYPE } from "@/features/dynamic-url/apollo/queries/cms";
import { getClient } from "@/lib/apollo/client";
import he from "he";
import React from "react";
import CMS_PAGE, { CmsPageType } from "../apollo/query";
import styles from "../styles/style.module.scss";
import BannerComponent from "../components/BannerComponent";
import parse from "html-react-parser";
import dynamic from "next/dynamic";
// import AboutUsEnquiry from "../components/AboutUsEnquiry";

const AboutUsEnquiry = dynamic(() => import("../components/AboutUsEnquiry"));

type CmsPageProps = {
  identifier: string;
  slug: string[];
};
async function CmsPage({ identifier, slug }: CmsPageProps) {
  const client = getClient();
  const response = await client.query<
    CmsPageType["Response"],
    CmsPageType["Variables"]
  >({
    query: CMS_PAGE,
    variables: {
      identifier: identifier,
    },
    fetchPolicy: "no-cache",
  });

  const decodedHtml = he.decode(response.data.cmsPage?.content || "");
  const cmsPageName = slug?.[0];

  // const options = {
  //   replace: (domNode: any) => {
  //     if (
  //       domNode.name === "div" &&
  //       domNode.attribs &&
  //       domNode.attribs["data-content-type"] === "banner"
  //     ) {
  //       return <BannerComponent content={domNode.children} />;
  //     }
  //     // Add more custom element mappings here
  //   },
  // };

  return (
    <div
      className={`cms_page ${styles.cms_page} ${cmsPageName}`}
      id="html-body"
    >
      <div className="container">
        <div
          className="cms_content"
          dangerouslySetInnerHTML={{ __html: decodedHtml }}
        >
          {/* {parse(decodedHtml, options)} */}
        </div>

        {/* {cmsPageName === "about-us" ? <AboutUsEnquiry /> : null} */}
      </div>
    </div>
  );
}

export default CmsPage;
