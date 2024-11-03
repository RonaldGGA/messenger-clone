"use client";
import axios from "axios";
import React, { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ConfirmModalProps {
  children: React.ReactNode;
  conversationId?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  children,
  conversationId,
}) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const onDelete = useCallback(() => {
    startTransition(() => {
      axios
        .delete(`/api/conversations/${conversationId}`)
        .then(() => {
          router.push("/conversations");
          router.refresh();
        })
        .catch(() => {
          toast.error("An error ocurred");
        });
    });
  }, [conversationId, router]);

  return (
    <Dialog>
      <DialogContent className="text-center rounded">
        <DialogHeader className="mt-2">
          <DialogTitle>
            Are you sure you want to delete this entire conversation?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-rose-500">
          This can not be undone, everything will be lost
        </DialogDescription>
        <DialogFooter className="flex flex-row gap-2 mt-5 items-center justify-center">
          <DialogClose>
            <Button disabled={isPending}>Cancelar</Button>
          </DialogClose>
          <DialogClose>
            <Button disabled={isPending} onClick={onDelete} variant={"outline"}>
              Aceptar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  );
};

export default ConfirmModal;
