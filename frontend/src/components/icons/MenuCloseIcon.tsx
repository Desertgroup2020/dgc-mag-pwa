import * as React from "react"
import { SVGProps } from "react"

const MenuCloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 15"
    {...props}
  >
    <path
      data-name="Path 56"
      d="M.113 14.357a.359.359 0 0 0 .271.128.359.359 0 0 0 .271-.128l5.692-6.5 1.318 1.509 4.372 4.991a.35.35 0 0 0 .542 0 .482.482 0 0 0 0-.618l-3.135-3.578-2.557-2.919 1.8-2.058L12.579.746a.482.482 0 0 0 0-.618.35.35 0 0 0-.542 0l-5.692 6.5-.865-.992-1.619-1.849L.654.128a.35.35 0 0 0-.542 0 .482.482 0 0 0 0 .618L5.8 7.242l-5.692 6.5a.482.482 0 0 0 .005.615Z"
      fill="#f33f3f"
    />
  </svg>
)

export default MenuCloseIcon