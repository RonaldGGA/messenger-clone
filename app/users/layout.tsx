import React from "react";
import SideBar from "./_components/SideBar";
import getUsers from "../actions/getUsers";
import UserList from "./_components/usersList/UserList";
import ActiveStatus from "../_components/ActiveStatus";

interface UsersLayoutProps {
  children: React.ReactNode;
}

const UsersLayout = async ({ children }: UsersLayoutProps) => {
  // const { user } = await getCurrentUser();
  const users = await getUsers();
  // console.log(users);
  return (
    <SideBar>
      <div className="h-full flex w-full ">
        <UserList users={users} />
        <ActiveStatus />
        {children}
      </div>
    </SideBar>
  );
};

export default UsersLayout;
