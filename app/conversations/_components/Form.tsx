"use client";

import useConversations from "@/hooks/useConversation";
import axios from "axios";
import React from "react";
import { HiPhoto } from "react-icons/hi2";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi";
import { CldUploadButton } from "next-cloudinary";
import InputMessage from "./InputMessage";
import { toast } from "sonner";

const MessagesForm = () => {
  const { conversationId } = useConversations();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios
      .post(`/api/messages`, {
        ...data,
        conversationId,
      })
      .then((data) => {
        toast.error(data.data.message);
        // console.log(data.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = (result: any) => {
    axios.post(`/api/messages`, {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div className="p-2 w-full border-t border-gray-300 flex flex-row items-center gap-3">
      {/**Change the UploadPreset in the cloudinary configs to unsigned then copy the name in the config below*/}
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleImageUpload}
        uploadPreset="koovkg7o"
      >
        <HiPhoto
          size={32}
          className="text-gray-600 cursor-pointer hover:text-gray-700"
        />
      </CldUploadButton>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-row w-full gap-2"
      >
        <InputMessage
          id={"message"}
          placeholder="Write a message"
          type="string"
          register={register}
          errors={errors}
          required={true}
        />
        <button
          type="submit"
          className=" rounded-full  bg-gray-400 cursor-pointer hover:bg-gray-700  px-2.5 transition"
        >
          <HiPaperAirplane size={16} className="rotate-90 text-white" />
        </button>
      </form>
    </div>
  );
};

export default MessagesForm;
