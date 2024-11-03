"use client";

import React, { useTransition } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useCurrentUser from "@/hooks/useCurrentUser";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import { toast } from "sonner";
import { CldUploadButton } from "next-cloudinary";
import AvatarComponent from "../users/_components/Avatar";
import { Button } from "@/components/ui/button";
import InputMessage from "../conversations/_components/InputMessage";
import { useRouter } from "next/navigation";
interface SettingsModalProps {
  children: React.ReactNode;
}

//CHange the settings modal, so i can show the cldUpload Modal, or modify the last one
const SettingsModal: React.FC<SettingsModalProps> = ({ children }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const {
    register,

    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = (result: any) => {
    const content = document.getElementById("dialog-content");

    startTransition(() => {
      setValue("image", result?.info?.secure_url, { shouldValidate: true });
      toast.success("Image uploaded successfully!");
      content?.classList.remove("hidden");
    });
  };
  const handleOpen = () => {
    const content = document.getElementById("dialog-content");
    content?.classList.add("hidden");
  };
  // useEffect(() => {
  //   const handleClick = (e) => {
  //     const dialogContent = document.getElementById("dialog-content");
  //     if (dialogContent && !dialogContent.contains(e.target)) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener("click", handleClick);

  //   return () => {
  //     document.removeEventListener("click", handleClick);
  //   };
  // }, []);
  const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
    startTransition(() => {
      axios
        .post("/api/settings", { data })
        .then(() => {
          router.refresh();
        })
        .catch((error) => {
          toast.error(error);
        });
    });
  };

  const image = watch("image");
  return (
    <>
      <CldUploadButton
        onOpen={handleOpen}
        className="z-[1002] hidden"
        onSuccess={handleImageUpload}
        uploadPreset="koovkg7o"
        options={{ maxFiles: 1 }}
      >
        <span id="upload-button">Upload</span>
      </CldUploadButton>
      {/* <Dialog open={isOpen}> */}
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent id="dialog-content">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Profile</DialogTitle>
            <p className="text-gray-600">Edit your public information</p>
          </DialogHeader>
          <DialogDescription>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="z-[1000]"
            >
              <div className="flex flex-col items-center z-[1001] gap-4">
                <div className="space-y-2">
                  <InputMessage
                    register={register}
                    disabled={isPending}
                    label="Name"
                    id="name"
                    required
                    errors={errors}
                    className="rounded-sm bg-white"
                  />
                </div>

                {/* <button onClick={() => setIsOpen(true)}> */}
                <AvatarComponent
                  // onClick={() => setIsOpen(true)}
                  image={image}
                />
                {/* // </button> */}
                <Button
                  variant={"secondary"}
                  type="button"
                  onClick={() =>
                    document.getElementById("upload-button")?.click()
                  }
                >
                  Upload
                </Button>
              </div>
              <div className="flex flex-row gap-2 items-center justify-end">
                <DialogClose>
                  <Button
                    // onClick={() => setIsOpen(false)}
                    type="button"
                    size="sm"
                    variant={"ghost"}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button type="submit" size="sm" variant="save">
                    Save
                  </Button>
                </DialogClose>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsModal;
