"use client";

import clsx from "clsx";
import Link from "next/link";
import React from "react";

const MobileSideBarItem = ({
  href,
  icon: Icon,
  label,
  onClick,
  active,
}: {
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        "flex-1 flex items-center justify-center py-4 text-lg font-bold  gap-1 transition-colors",
        active && "text-black bg-gray-200",
        !active && "text-gray-500 bg-white hover:bg-gray-100"
      )}
    >
      <Icon />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export default MobileSideBarItem;
