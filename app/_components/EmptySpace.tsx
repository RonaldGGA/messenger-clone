import React from "react";

const EmptySpace = () => {
  return (
    <div className="hidden md:flex flex-1 h-screen items-center justify-center text-center md:pl-80 w-full">
      <div className="h-full bg-gray-100 w-full">
        <div className="flex items-center justify-center h-full">
          <h3 className="font-bold text-gray-900">
            Select a chat or start a new conversation
          </h3>
        </div>
      </div>
    </div>
  );
};

export default EmptySpace;
