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
  className: string;
}

function CategoryModal({ children, isOpen, setIsOpen, className }: ModalProps) {
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const isMobile = useMemo(() => winWidth && winWidth < 768, [winWidth]);

  // if (!isMobile)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogContent className="h-full flex flex-col gap-4" style={{display:"flex", gap:"1rem", overflow:"auto"}}>
        <div className="flex flex-col gap-3">{children}</div>
      </DialogContent>
    </Dialog>
  );

  return null;
}

export default CategoryModal;
