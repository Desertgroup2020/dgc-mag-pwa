import * as React from "react"
import { SVGProps } from "react"

const FooterCallIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="1 12 25 1"
    fill="none"
    {...props}
  >
    <path
      stroke="#7E8B53"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M21.14 18.325c-.744-.75-2.546-1.845-3.421-2.286-1.139-.574-1.233-.62-2.128.045-.597.444-.994.84-1.693.691-.7-.15-2.218-.99-3.548-2.315-1.33-1.326-2.219-2.889-2.368-3.585-.15-.697.253-1.09.693-1.688.62-.843.573-.984.043-2.123-.413-.886-1.54-2.672-2.292-3.413-.805-.795-.805-.654-1.324-.439a7.5 7.5 0 0 0-1.211.646c-.75.498-1.166.912-1.457 1.534-.292.622-.422 2.08 1.081 4.811s2.558 4.127 4.74 6.304c2.184 2.177 3.862 3.348 6.316 4.724 3.036 1.7 4.2 1.369 4.824 1.078.624-.29 1.04-.703 1.54-1.453.252-.383.468-.787.646-1.21.216-.517.357-.517-.44-1.321Z"
    />
  </svg>
)
export default FooterCallIcon