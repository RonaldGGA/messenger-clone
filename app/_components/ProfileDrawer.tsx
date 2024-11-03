import React from "react";

import { Ellipsis } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MdClose, MdDelete } from "react-icons/md";
import { format } from "date-fns";
import AvatarComponent from "@/app/users/_components/Avatar";
import { Conversation, User } from "@prisma/client";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "./AvatarGroup";

interface ProfileDrawerProps {
  otherUser: User;
  statusText?: string;
  conversationId?: string;
  conversation?: Conversation & {
    users: User[];
  };
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  otherUser,
  statusText,
  conversationId,
  conversation,
}) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger
        asChild
        className="ml-auto mr-3 cursor-pointer text-gray-500 hover:text-gray-800 transition"
      >
        <Ellipsis size={30} />
      </DrawerTrigger>
      <DrawerContent className="h-full ml-auto w-1/2 ">
        <DrawerClose className="ml-auto mr-5 p-3 hover:ring-1 hover:ring-neutral-500 rounded-md">
          <MdClose />
        </DrawerClose>
        <DrawerHeader className="flex items-center justify-center flex-col gap-1">
          <DrawerTitle className="">
            {conversation?.isGroup ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <AvatarGroup users={conversation?.users} />
                <p className="text-lg font-bold text-black">
                  {conversation?.name || otherUser?.name}
                </p>
                <span className="text-sm  text-gray-700">{statusText}</span>
                <ConfirmModal conversationId={conversationId}>
                  <div className="group cursor-pointer ring-1  rounded-sm ring-gray-100 mt-10 flex items-center justify-center flex-col">
                    <MdDelete
                      size={32}
                      className="group-hover:text-neutral-900 transition"
                    />

                    <p className="mt-2 font-semibold text-neutral-950">
                      Delete
                    </p>
                  </div>
                </ConfirmModal>
                <dt className="text-gray-600 mt-4">Emails</dt>
                <div className="text-sm text-gray-800">
                  {conversation?.users.map((user) => (
                    <p key={user.id}>- {user.email}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <AvatarComponent user={otherUser} />
                <p className="text-lg font-bold text-black">
                  {conversation?.name || otherUser?.name}
                </p>
                <span className="text-sm  text-gray-700">{statusText}</span>
              </div>
            )}
          </DrawerTitle>
          {!conversation?.isGroup && (
            <DrawerDescription className="text-center  w-full flex flex-col">
              <ConfirmModal conversationId={conversationId}>
                <div className="group cursor-pointer ring-1  rounded-sm ring-gray-100 mt-10 flex items-center justify-center flex-col">
                  <MdDelete
                    size={32}
                    className="group-hover:text-neutral-900 transition"
                  />

                  <p className="mt-2 font-semibold text-neutral-950">Delete</p>
                </div>
              </ConfirmModal>
              <div className="mt-7 text-start w-full flex flex-col gap-4">
                <div className="space-y-1  p-2">
                  <p className="text-gray-600 ">Email:</p>
                  <p className="text-gray-800">{otherUser?.email}</p>
                </div>
                <div className="space-y-1 p-2">
                  <p className="flex flex-col gap-2">Joined:</p>
                  <time
                    className="text-gray-800"
                    dateTime={format(new Date(otherUser?.createdAt), "PP")}
                  >
                    {format(new Date(otherUser?.createdAt), "PP")}
                  </time>
                </div>
              </div>
            </DrawerDescription>
          )}
        </DrawerHeader>

        {/* <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};

export default ProfileDrawer;
