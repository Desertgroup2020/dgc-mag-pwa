"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAppSelector } from "@/redux/hooks";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  discription?: string;
  className?: string;
  notCloseOnOutside?: boolean;
}

function Modal({
  children,
  discription,
  isOpen,
  setIsOpen,
  title,
  className,
  notCloseOnOutside,
}: ModalProps) {
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const isMobile = useMemo(() => winWidth && winWidth < 768, [winWidth]);

  // if (!isMobile)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={`common_modal ${className}`}
        onInteractOutside={(e) => {
          if (notCloseOnOutside) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="modal_header">
          {title ? (
            <DialogTitle className="modal_title text-h2">{title}</DialogTitle>
          ) : null}

          {discription ? (
            <DialogDescription className="modal_desc">
              {discription}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );

  return null;
}

export default Modal;
