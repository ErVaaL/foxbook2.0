import React from "react";
import styles from "./ChatList.module.css";

const ChatList: React.FC = () => {
  return (
    <aside className={`${styles.chatList} w-1/6 shadow-lg p-4`} id="chatList">
      <div className="flex flex-col items-center text-center">
        <h2 className="flex flex-grow m-2 text-2xl font-bold">Chat List</h2>
        <ul className="space-y-2 w-full">
          <li className="p-2 rounded-lg hover:cursor-pointer  hover:bg-gray-200 dark:hover:bg-[#b8860b]">
            Chat 1
          </li>
          <li className="p-2 rounded-lg hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-[#b8860b]">
            Chat 2
          </li>
          <li className="p-2 rounded-lg hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-[#b8860b]">
            Chat 3
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default ChatList;
