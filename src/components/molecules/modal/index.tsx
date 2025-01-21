"use client";

import React, { ReactNode } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";

interface ModalProps {
  trigger: ReactNode;
  title: string;
  footer?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  width?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Modal = ({
  trigger,
  title,
  footer,
  onConfirm,
  onCancel,
  children,
  width = "md",
}: ModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={`max-w-${width}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
          {footer ? (
            footer
          ) : (
            <>
              <Button onClick={onCancel} variant="secondary">
                Cancel
              </Button>
              <Button onClick={onConfirm} type="submit">
                Confirm
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
