import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface DropDownUiProps {
  open: boolean;
  handleClose?: () => void;
  children: React.ReactNode;
}
function DropDownUi({ children, open, handleClose }: DropDownUiProps) {
    const comp = useRef<HTMLDivElement|null>(null)
    useEffect(()=>{
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline();

            timeline
        })
    }, [open])

  return (
    <div className="drop_down_wrapper" ref={comp}>
      <div className="drop_down">{children}</div>
    </div>
  );
}

export default DropDownUi;
