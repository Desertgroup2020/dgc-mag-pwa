import * as React from "react"
import { SVGProps } from "react"
const ResponsiveYoutube = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#939393"
      fillRule="evenodd"
      d="M15.54 5.011c.65.175 1.166.69 1.341 1.342.321 1.187.331 3.647.331 3.647s0 2.47-.32 3.647a1.908 1.908 0 0 1-1.343 1.342c-1.177.321-5.913.321-5.913.321s-4.736 0-5.912-.32a1.908 1.908 0 0 1-1.343-1.343c-.32-1.186-.32-3.647-.32-3.647s0-2.46.31-3.637a1.908 1.908 0 0 1 1.343-1.342c1.177-.32 5.913-.33 5.913-.33s4.736 0 5.912.32Zm-3.492 4.99L8.12 12.275V7.725L12.05 10Z"
      clipRule="evenodd"
    />
  </svg>
)
export default ResponsiveYoutube
