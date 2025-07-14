"use client";

import BtnRightArrow from "@/components/icons/BtnRightArrow";
import Modal from "@/components/reusable-uis/Modal";
import { Button } from "@/components/ui/button";
import { throttle } from "@/lib/utils";
import React, { useLayoutEffect, useRef, useState } from "react";
import EnquiryForm from "./EnquiryForm";

function AboutUsEnquiry() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const enquiryBtnRef = useRef<HTMLButtonElement | null>(null);

//   states
const [makeEnquiry, setMakeEnquiry] = useState(false);

  // fetures
  const handleScroll = throttle(() => {
    if (parentRef.current && enquiryBtnRef.current) {
      const wScrollTop = window.scrollY;
      const parentScrolPos = (parentRef.current.getBoundingClientRect().top + window.scrollY) - window.innerHeight;

      if (wScrollTop >= parentScrolPos) {
        enquiryBtnRef.current.classList.add("stay");
      } else {
        enquiryBtnRef.current.classList.remove("stay");
      }
    }
  }, 100);
  const handleMakeEnquiry = ()=> setMakeEnquiry(prev=>!prev);

  // effects
  useLayoutEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="about_enquiry" ref={parentRef}>
      <Button
        ref={enquiryBtnRef}
        type="submit"
        variant={"action_green"}
        className="btn_action_green_rounded"
        onClick={(e) => {
          e.preventDefault();
          setMakeEnquiry(true);
        }}
      >
        <BtnRightArrow />
        <span>MAKE AN ENQUIRY</span>
      </Button>

      <Modal
        isOpen={makeEnquiry}
        setIsOpen={handleMakeEnquiry}
        className="enquiry_modal"        
      >
        <EnquiryForm />
      </Modal>
    </div>
  );
}

export default AboutUsEnquiry;
