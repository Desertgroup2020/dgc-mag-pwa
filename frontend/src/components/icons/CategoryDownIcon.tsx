import * as React from "react"
import { SVGProps } from "react"

const CategoryDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={6}
    fill="none"
    {...props}
  >
    <path
      fill="#7e8b53"
      fillRule="evenodd"
      d="M.333.333 5 5.667 9.667.333H.333Z"
      clipRule="evenodd"
    />
  </svg>
)
export default CategoryDownIcon
