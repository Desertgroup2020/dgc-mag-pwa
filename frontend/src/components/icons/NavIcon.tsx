import * as React from "react"
import { SVGProps } from "react"
const NavIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={10}
    fill="none"
    {...props}
  >
    <path
      fill="#1B1B1B"
      d="M0 1.818h14V.545H0zM0 5.636h14V4.363H0zM0 9.455h14V8.182H0z"
    />
  </svg>
)
export default NavIcon
