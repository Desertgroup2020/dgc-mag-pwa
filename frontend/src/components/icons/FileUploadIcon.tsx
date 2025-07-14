import * as React from "react";
import { SVGProps } from "react";

const FileUploadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.375 8.9375V11.375H1.625V8.9375H0V11.375C0 12.2688 0.73125 13 1.625 13H11.375C12.2688 13 13 12.2688 13 11.375V8.9375H11.375ZM2.4375 4.0625L3.58312 5.20813L5.6875 3.11188V9.75H7.3125V3.11188L9.41687 5.20813L10.5625 4.0625L6.5 0L2.4375 4.0625Z"
      fill="#A5A5A5"
    />
  </svg>

);
export default FileUploadIcon;
