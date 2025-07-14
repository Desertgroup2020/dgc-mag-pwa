"use client";
import React, { useLayoutEffect, useRef } from "react";
import FooterFacebookIcon from "../../icons/FooterFacebook";
import FooterLinkedinIcon from "../../icons/FooterLinkedin";
import FooterTwitter from "../../icons/FooterTwitter";
import FooterYoutubeIcon from "../../icons/FooterYoutube";
import useNewsLetterForm from "@/features/account-section/hooks/useNewsletterForm";
import Link from "next/link";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { throttle } from "@/lib/utils";

const NewsletterBlock = () => {
  const scrltopRef = useRef<HTMLDivElement | null>(null);
  const { newsLetterForm, subscribeEmailToNewsletterStatus } =
    useNewsLetterForm();
  const handleScrollTop = ()=>{
    window.scrollTo({
      top:0,
      behavior: "smooth"
    })
  }
  const handleScroll = throttle(()=>{
    const scrolltop = window.scrollY;

    if(scrolltop > 110){
      scrltopRef.current?.classList.remove("hidden");
    }else{
      scrltopRef.current?.classList.add("hidden");
    }
  }, 200)

  useLayoutEffect(()=>{
    window.addEventListener("scroll", handleScroll);

    return ()=>{
      window.removeEventListener("scroll", handleScroll)
    }
  })

  return (
    <div className="newsletter_block_container">
      <div id="root" className="newsletter_inner_block flex flex-col gap-4 pl-3">
        <div className="scrol_top hidden" onClick={handleScrollTop} ref={scrltopRef}>
          <span className="txt">Scroll to top</span>
          <button>
            <BtnRightArrow fill="#7e8b53" stroke="#7e8b53" className="icon" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <span className="newsletter_title">Join Our Newsletter!</span>
          <span className="newsletter_desc">
            Will be used in accordance with our Privacy Policy
          </span>
        </div>
        <form onSubmit={newsLetterForm.handleSubmit}>
          <div className="flex input_wrapper">
            <input
              placeholder="Your email address"
              name="email"
              type="text"
              onChange={newsLetterForm.handleChange}
              className="newsletter_input"
              value={newsLetterForm.values.email}
            />
            <button
              type="submit"
              className="newsletter_button"
              disabled={subscribeEmailToNewsletterStatus.loading}
            >
              Sign up
            </button>
          </div>
        </form>
        <ul className="flex gap-2 social">
          <li>
            <Link href={"https://www.facebook.com/"} target="_blank">
              <FooterFacebookIcon />
            </Link>
          </li>
          <li>
            <Link href={"https://in.linkedin.com/"} target="_blank">
              <FooterLinkedinIcon />
            </Link>
          </li>
          <li>
            <Link href={"https://x.com/?lang=en"} target="_blank">
              <FooterTwitter />
            </Link>
          </li>
          <li>
            <Link href={"https://www.youtube.com/"} target="_blank">
              <FooterYoutubeIcon />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NewsletterBlock;
