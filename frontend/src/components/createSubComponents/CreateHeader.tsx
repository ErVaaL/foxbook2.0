import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type CreateHeaderButtonProps = {
  type: "posts" | "group" | "event";
  itemType?: string | null;
  text: string;
};

const CreateHeader: React.FC = () => {
  const [searchParams] = useSearchParams();
  const itemType = searchParams.get("item");

  return (
    <div className="flex justify-around p-4">
      <CreateHeaderButton type="posts" itemType={itemType} text="Post" />
      <CreateHeaderButton type="group" itemType={itemType} text="Group" />
      <CreateHeaderButton type="event" itemType={itemType} text="Event" />
    </div>
  );
};

export default CreateHeader;

const CreateHeaderButton: React.FC<CreateHeaderButtonProps> = ({
  type,
  itemType,
  text,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (type: string) => {
    navigate(`/create?item=${type}`);
  };
  return (
    <button
      onClick={() => handleNavigation(type)}
      className={`px-4 py-2 rounded ${
        itemType === type
          ? "bg-orange-500 dark:bg-darkgoldenrod text-white"
          : "bg-gray-100 dark:bg-gray-400 dark:text-gray-100 hover:bg-orange-600 dark:hover:bg-goldenrodhover"
      }`}
    >
      {text}
    </button>
  );
};
