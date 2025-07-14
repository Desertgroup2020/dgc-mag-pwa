import * as React from "react"
import { SVGProps } from "react"
const WishlistIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 18}
    height={props.height || 16}
    fill={props.fill || "none"}
    {...props}
  >
    <path
      fill={props.fill || "#494949"}
      d="M12.643 0A5.222 5.222 0 0 0 8.72 1.822 5.221 5.221 0 0 0 4.796 0C2.11 0 0 2.11 0 4.796c0 3.296 2.965 5.981 7.455 10.062L8.719 16l1.265-1.151c4.49-4.072 7.455-6.757 7.455-10.053C17.439 2.11 15.329 0 12.643 0ZM8.807 13.559l-.088.087-.087-.087C4.482 9.8 1.744 7.316 1.744 4.796c0-1.744 1.308-3.052 3.052-3.052 1.342 0 2.65.863 3.112 2.058H9.54c.453-1.195 1.761-2.058 3.104-2.058 1.744 0 3.052 1.308 3.052 3.052 0 2.52-2.738 5.005-6.888 8.763Z"
    />
  </svg>
)
export default WishlistIcon
