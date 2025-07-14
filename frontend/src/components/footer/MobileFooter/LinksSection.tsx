import React, { useState } from "react";
import linkSectionStyles from "../styles/linksSection.module.scss";
import dynamic from "next/dynamic";
import footerLinks from "../footerLinks.json";
import Link from "next/link";

const DynamicAccordionDownIcon = dynamic(
  () => import("../../icons/FooterAccordionIcon")
);

const LinksSection = () => {
  const [isUsefulLinkActive, setIsUsefulLinkActive] = useState(false);
  const [isCategoryLinkActive, setIsCategoryLinkActive] = useState(false);

  return (
    <div className={linkSectionStyles.link_section}>
      <div className="useful_link_section">
        <div
          className="flex justify-between items-center"
          onClick={() => setIsUsefulLinkActive(!isUsefulLinkActive)}
        >
          <span className="title">Useful Links</span>
          <button className={`${isUsefulLinkActive ? "arrow_change" : ""}`}>
            <DynamicAccordionDownIcon />
          </button>
        </div>
        {isUsefulLinkActive && (
          <div className="useful_links_dropdown_section">
            {footerLinks.UsefulLinks.map((items) => (
              <div key={items.href}>
                <Link href={items.href}>
                  <span className="category_name">{items.label}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="category_link_section">
        <div
          className="flex justify-between items-center"
          onClick={() => setIsCategoryLinkActive(!isCategoryLinkActive)}
        >
          <span className="title">Category Links</span>
          <button className={`${isCategoryLinkActive ? "arrow_change" : ""}`}>
            <DynamicAccordionDownIcon />
          </button>
        </div>
        {isCategoryLinkActive && (
          <div className="category_links_dropdown_section">
            {footerLinks.CategoryLinks.map((items) => (
              <div key={items.href}>
                <Link href={items.href}>
                  <span className="category_name">{items.label}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinksSection;
