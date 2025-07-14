// export const dynamic = "force-dynamic";

import React from "react";
import styles from "../../features/contact-us/styles/styles.module.scss";
import ContactUsClient from "@/features/contact-us/screens/ContactUsClient";

function ContactUs() {
  return (
    <div className={`contact_us ${styles.contact_us}`}>
      <div className="banner">
        <div className="container">
          <h1 className="text-h1">Contact Us</h1>
        </div>
      </div>
      <ContactUsClient />
    </div>
  );
}

export default ContactUs;
