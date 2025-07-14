import useNewsLetterForm from "@/features/account-section/hooks/useNewsletterForm";
import React from "react";
import newsletterStyles from "../styles/newsletterSection.module.scss";

const NewsletterSection = () => {
  const { newsLetterForm, subscribeEmailToNewsletterStatus } =
    useNewsLetterForm();
  return (
    <div className={newsletterStyles.newsletter_section}>
      <span className="title">Join Our Newsletter!</span>
      <span className="sub_title">Will be used in accordance with our Privacy Policy</span>
      <form onSubmit={newsLetterForm.handleSubmit}>
        <div className="input_wrapper">
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
    </div>
  );
};

export default NewsletterSection;
