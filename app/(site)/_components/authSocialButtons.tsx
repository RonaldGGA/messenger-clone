import { Button } from "@/components/ui/button";

import React from "react";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon?: IconType;
  onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <Button
      className="w-full"
      variant={"ghost"}
      type="submit"
      onClick={onClick}
    >
      {Icon && <Icon />}
    </Button>
  );
};

export default AuthSocialButton;
