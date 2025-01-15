import React from "react";
import GroupCreation from "../../forms/GroupCreation";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type CreateBodyProps = {
  itemType: string | null;
};

const CreateBody: React.FC<CreateBodyProps> = ({ itemType }) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  if (itemType === "posts" && isLoggedIn) return <PostCreation />;
  if (itemType === "group" && isLoggedIn) return <GroupCreation />;
  if (itemType === "event" && isLoggedIn) return <EventCreation />;

  return isLoggedIn ? (
    <div className="flex flex-col items-center p-4">
      <h1 className="dark:text-gray-300">Select an item from above</h1>
      <img src="https://http.cat/404" alt="" />
    </div>
  ) : (
    <div className="flex flex-col items-center">
      <h1 className="dark:text-gray-300 p-4">
        You must be logged in to use this function
      </h1>
      <img src="https://http.cat/401" alt="" />
    </div>
  );
};

export default CreateBody;
