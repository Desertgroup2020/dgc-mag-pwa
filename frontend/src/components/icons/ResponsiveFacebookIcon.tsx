import * as React from "react"
import { SVGProps } from "react"
const ResponsiveFacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#939393"
      d="M15.667 8.046c0-4.21-3.392-7.622-7.576-7.622C3.907.424.515 3.836.515 8.046c0 3.805 2.77 6.958 6.392 7.53V10.25H4.984V8.046h1.923v-1.68c0-1.91 1.131-2.965 2.862-2.965.828 0 1.696.15 1.696.15v1.875h-.956c-.941 0-1.234.588-1.234 1.19v1.43h2.1l-.335 2.203H9.275v5.327c3.622-.572 6.392-3.725 6.392-7.53Z"
    />
  </svg>
)
export default ResponsiveFacebookIcon
