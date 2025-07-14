import * as React from "react"
import { SVGProps } from "react"
const ShoppingCartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <path
      fill="#494949"
      d="M12.367 9.35c.638 0 1.199-.348 1.488-.875l3.043-5.517a.847.847 0 0 0-.74-1.258H3.579L2.78 0H0v1.7h1.7l3.06 6.452-1.147 2.074c-.621 1.138.195 2.524 1.487 2.524h10.2v-1.7H5.1l.935-1.7h6.332ZM4.386 3.4h10.328l-2.347 4.25H6.4L4.386 3.4ZM5.1 13.6c-.935 0-1.691.765-1.691 1.7 0 .935.756 1.7 1.691 1.7s1.7-.765 1.7-1.7c0-.935-.765-1.7-1.7-1.7Zm8.5 0c-.935 0-1.691.765-1.691 1.7 0 .935.756 1.7 1.691 1.7s1.7-.765 1.7-1.7c0-.935-.765-1.7-1.7-1.7Z"
    />
  </svg>
)
export default ShoppingCartIcon