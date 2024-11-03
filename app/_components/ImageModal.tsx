import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

interface ImageModalProps {
  image: string;
  children: React.ReactNode;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, children }) => {
  if (!image) {
    return null;
  }
  return (
    <Dialog>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle
              onClick={() => {
                navigator.clipboard
                  .writeText(image)
                  .then(() => {
                    toast.success("TEXT COPIED TO THE CLIPBOARD");
                    console.log("Texto copiado al portapapeles: ", image);
                    // Puedes agregar un mensaje o notificación aquí si lo deseas
                  })
                  .catch((err) => {
                    console.error("Error al copiar el texto: ", err);
                  });
              }}
              className="cursor-pointer truncate  max-w-[450px] text-wrap"
            >
              Image source : {image}
            </DialogTitle>
          </DialogHeader>
          <Image
            className="mt-4"
            src={image}
            width={500}
            height={600}
            alt="Image"
          />
        </DialogContent>
      </DialogPortal>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  );
};

export default ImageModal;
