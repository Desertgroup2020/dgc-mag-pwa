import * as React from "react";
import { SVGProps } from "react";
const VideoPause = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_b_3343_630)">
      <rect width="42" height="42" rx="21" fill="black" fill-opacity="0.45" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.379 31.4018C15.6133 31.5352 15.9011 31.5325 16.1329 31.3949L19.1329 29.6136C19.4891 29.4022 19.6064 28.942 19.3949 28.5858C19.1834 28.2297 18.7233 28.1124 18.3671 28.3239L16.5 29.4324V13.0676L30.281 21.25L22.3671 25.9489C22.0109 26.1603 21.8936 26.6205 22.1051 26.9767C22.3166 27.3328 22.7767 27.4501 23.1329 27.2386L32.1329 21.8949C32.3605 21.7598 32.5 21.5147 32.5 21.25C32.5 20.9853 32.3605 20.7402 32.1329 20.6051L16.1329 11.1051C15.9011 10.9675 15.6133 10.9648 15.379 11.0982C15.1447 11.2316 15 11.4804 15 11.75V30.75C15 31.0196 15.1447 31.2684 15.379 31.4018Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_b_3343_630"
        x="-4"
        y="-4"
        width="50"
        height="50"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
        <feComposite
          in2="SourceAlpha"
          operator="in"
          result="effect1_backgroundBlur_3343_630"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_backgroundBlur_3343_630"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default VideoPause;
