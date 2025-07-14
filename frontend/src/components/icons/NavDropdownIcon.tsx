import * as React from "react"
import { SVGProps } from "react"
const NavDropdownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 6}
    height={props.height || 4}
    fill={props.fill || "none"}
    {...props}
  >
    <path
      fill={props.fill || '#1B1B1B'}
      d="m.676.357 2.199 2.031 2.2-2.03.675.624-2.875 2.66L0 .983.676.357Z"
    />
  </svg>
)
export default NavDropdownIcon
