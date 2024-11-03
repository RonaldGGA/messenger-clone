import ImageModal from "@/app/_components/ImageModal";
import { FullMessageType } from "@/app/types";
import AvatarComponent from "@/app/users/_components/Avatar";
import useCurrentUser from "@/hooks/useCurrentUser";
import clsx from "clsx";
import { format } from "date-fns";
import { CldImage } from "next-cloudinary";
import React, { useMemo } from "react";

interface MessageBoxProps {
  isLast?: boolean;
  message: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, message }) => {
  const isOwn = useCurrentUser()?.email === message?.sender?.email;
  const seenList = useMemo(() => {
    return (message?.seen || [])
      .filter((user) => user.email !== message?.sender?.email) //remove the sender of the user
      .map((user) => user.name) //Just return the name of the users as an array of strings
      .join(", "); //convert it in a single string separated by a comma
  }, [message?.seen, message?.sender?.email]);

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2 mt-auto");

  const body = clsx("flex flex-col gap-2", isOwn && "items-end");

  const messageContent = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-gray-500 text-white" : "bg-gray-100",
    message.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <AvatarComponent user={message.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{message.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(message.createdAt), "p")}
          </div>
        </div>
        <div className={messageContent}>
          {message.body ? (
            <p>{message.body}</p>
          ) : message.image ? (
            <ImageModal image={message.image}>
              <CldImage
                alt="Coundt upload the message"
                src={message.image}
                width={150}
                height={150}
                className="hover:scale-95 transition-all duration-500"
              />
            </ImageModal>
          ) : (
            <p className="text-rose-500">No content avaible</p>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
