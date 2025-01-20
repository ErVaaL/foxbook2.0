import React, { useEffect, useRef } from "react";
import { PostFormValues, User } from "./PostCreation";
import { FormikHelpers } from "formik";

type UserMentionProps = {
  index: number;
  selectedMentionIndex: number;
  user: User;
  setFieldValue: FormikHelpers<PostFormValues>["setFieldValue"];
  setSelectedMentionIndex: React.Dispatch<React.SetStateAction<number>>;
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setMentionIndex: React.Dispatch<React.SetStateAction<number | null>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleUserSelect: (
    user: User,
    setFieldValue: FormikHelpers<PostFormValues>["setFieldValue"],
  ) => void;
};

const UserMention: React.FC<UserMentionProps> = ({
  index,
  selectedMentionIndex,
  user,
  setFieldValue,
  setSelectedMentionIndex,
  handleUserSelect,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedMentionIndex === index && itemRef.current) {
      itemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [index, selectedMentionIndex]);

  return (
    <div
      ref={itemRef}
      className={`dark:bg-[#1a1a1a] dark:text-gray-300 flex items-center p-2 cursor-pointer ${
        selectedMentionIndex === index
          ? "bg-gray-300 dark:bg-[#2e2e2e]"
          : "hover:bg-gray-100 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-300"
      }`}
      onClick={() => handleUserSelect(user, setFieldValue)}
      onMouseEnter={() => setSelectedMentionIndex(index)}
    >
      {user.attributes.avatar && (
        <img
          src={user.attributes.avatar}
          alt="avatar"
          className="w-6 h-6 rounded-full mr-2"
        />
      )}
      <span className="font-medium">@{user.attributes.username}</span>
    </div>
  );
};

export default UserMention;
