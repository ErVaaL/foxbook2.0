import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import ChatList from "./chatList/ChatList";
import HeaderSidebar from "./headerSidebar/HeaderSidebar";
import NotificationComponent from "./NotificationComponent";

const Layout: React.FC = () => {
  const location = useLocation();

  const noChatPages = ["/login", "/register"];

  return (
    <div className="flex h-full min-h-screen ">
      <HeaderSidebar />
      <main
        id="content"
        className={`bg-gray-200 dark:bg-[#1e1e1e] transition-colors duration-200 flex-grow p-0 overflow-auto w-full pt-0 min-h-screen`}
      >
        <Outlet />
      </main>
      <div className="absolute top-4 right-72 z-50"></div>
      {!noChatPages.includes(location.pathname) && <ChatList />}
      <NotificationComponent />
    </div>
  );
};

export default Layout;
