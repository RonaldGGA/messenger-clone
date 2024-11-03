"use server";

import { User } from "@prisma/client";
import React from "react";
import UserBox from "./UserBox";
import { Separator } from "@/components/ui/separator";

interface UserListProps {
  users: User[];
}
const UserList: React.FC<UserListProps> = ({ users }) => {
  // console.log({ USERHERE: users });
  return (
    <div className="fixed inset-y-0 md:left-[50px]  md:h-screen text-4xl z-20 bg-white w-full flex-1 md:w-80 md:max-w-80">
      <h1 className=" text-xl font-bold p-3 ">People</h1>
      <Separator />
      {users?.map((user) => (
        <UserBox key={user?.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;
