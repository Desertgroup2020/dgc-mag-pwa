import React, { ReactNode } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { DialogProps } from "@radix-ui/react-dialog";

interface SiteSheetProps {
  opts: DialogProps;
  title?: string;
  desc?: string;
  children: ReactNode;
  notCloseOnOutside?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}
function SiteSheet({
  opts,
  title,
  desc,
  children,
  notCloseOnOutside,
  position,
  className,
}: SiteSheetProps) {
  return (
    <div className="site_sheet">
      <Sheet {...opts}>        
        <SheetContent
          side={position}
          className={`common_sheet ${className}`}
          onInteractOutside={(e) => {
            if (notCloseOnOutside) {
              e.preventDefault();
            }
          }}
        >
          <SheetHeader className="sheet_header">
            <SheetTitle className="text-h2 title">{title}</SheetTitle>
          </SheetHeader>
          <div className="sheet_body">{children}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default SiteSheet;
