import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import useActiveList from "@/hooks/useActiveList";

type User2 = {
  name: string;
  email: string;
  id?: string;
  image?: string;
};
interface AvatarComponentProps {
  user?: User | User2 | undefined;
  onClick?: () => void;
  image?: string | null;
}

const AvatarComponent: React.FC<AvatarComponentProps> = ({
  user,
  onClick,
  image,
}) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email as string) !== -1;
  return (
    <Avatar
      onClick={onClick}
      className="bg-transparent w-10 h-10 hover:opacity-90 transition cursor-pointer rounded-none"
    >
      {isActive && (
        <span className="w-2 h-2 z-30 rounded-full md:w-3 md:h-3 block ring-2 ring-white bg-emerald-500 absolute top-0 right-0" />
      )}
      <AvatarFallback className="rounded-full font-bold bg-purple-400 flex items-center justify-center  w-8 h-8 collapse">
        U
      </AvatarFallback>

      <AvatarImage
        className="rounded-full"
        src={user?.image || image || "/avatar.png"}
      />
    </Avatar>
  );

  // <div className=" flex items-center justify-center w-full h-full relative">

  {
    /* <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500 ring-2 ring-white absolute -right-1 -top-1" />
    </div> */
  }
};

export default AvatarComponent;
