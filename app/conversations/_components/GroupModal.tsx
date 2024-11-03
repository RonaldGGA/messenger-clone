import InputComponent from "@/app/(site)/_components/InputComponent";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
// import {
//   Select,
//   SelectValue,
//   SelectTrigger,
//   SelectGroup,
//   SelectContent,
//   SelectLabel,
//   SelectItem,
// } from "@/components/ui/select";
import { User } from "@prisma/client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import Select from "./Select";

interface GroupModalProps {
  users: User[];
  children: React.ReactNode;
}

const GroupModal: React.FC<GroupModalProps> = ({ users, children }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    startTransition(() => {
      axios
        .post("/api/conversations", {
          ...data,
          isGroup: true,
        })
        .then(() => {
          router.refresh();
          toast.success("group-created");
        })
        .catch((error) => {
          toast.error(error);
        })
        .finally(() => document.getElementById("close")?.click());
    });
  };
  const members = watch("members");

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Group</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <InputComponent
              errors={errors}
              register={register}
              type="text"
              label="Name*"
              placeholder="group-name"
              id="name"
            />
            <Select
              label="Select Group Members*"
              disabled={isPending}
              onChange={(newValue) => {
                setValue("members", newValue, { shouldValidate: true });
              }}
              users={users}
              value={members}
            />
            <DialogClose id="close">
              <Button disabled={isPending} variant={"ghost"}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} type="submit">
              Save
            </Button>
          </form>
        </DialogDescription>
      </DialogContent>
      <DialogTrigger> {children}</DialogTrigger>
    </Dialog>
  );
};

export default GroupModal;
