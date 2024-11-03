"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useTransition } from "react";
import AvatarComponent from "../Avatar";
import LoadingModal from "@/app/_components/LoadingModal";

/**Recives a single user data and initializes new conversations */
const UserBox = ({ user }: { user: User }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const handleClick = useCallback(() => {
    startTransition(() => {
      axios.post("/api/conversations", { userId: user.id }).then((data) => {
        console.log("WHAT IS GOING ON");
        // console.log(data);
        if (data.data.data.id) {
          router.push(`/conversations/${data.data.data.id}`);
        }
      });
    });
  }, [user, router]);

  return (
    <>
      {isPending && <LoadingModal />}
      <div
        onClick={handleClick}
        className="cursor-pointer bg-white w-full p-3 text-sm hover:bg-gray-200 transition focus:outline-none focus:ring-none flex items-center justify-center gap-5"
      >
        <div>
          <AvatarComponent user={user} />
        </div>
        <div className="flex-1">{user.name}</div>
      </div>
    </>
  );
};

export default UserBox;
