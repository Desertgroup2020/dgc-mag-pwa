import * as React from "react"
import { SVGProps } from "react"
const MobileSearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <path
      fill="#494949"
      d="M12.15 10.692h-.768l-.272-.263a6.29 6.29 0 0 0 1.526-4.111 6.318 6.318 0 1 0-6.318 6.318 6.29 6.29 0 0 0 4.111-1.526l.263.272v.768l4.86 4.85L17 15.552l-4.85-4.86Zm-5.832 0a4.368 4.368 0 0 1-4.374-4.374 4.368 4.368 0 0 1 4.374-4.374 4.368 4.368 0 0 1 4.374 4.374 4.368 4.368 0 0 1-4.374 4.374Z"
    />
  </svg>
)
export default MobileSearchIcon
