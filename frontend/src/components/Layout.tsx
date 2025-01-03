import React from "react";
import { useLocation } from "react-router-dom";
import ChatList from "./chatList/ChatList";
import HeaderSidebar from "./headerSidebar/HeaderSidebar";
import styles from "./Layout.module.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const noChatPages = ["/login", "/register"];

  return (
    <div className="flex h-full ">
      <HeaderSidebar />
      <main id="content" className={`${styles.mainComponent} flex-grow p-4 overflow-auto w-full`}>
        {children}
      </main>
      {!noChatPages.includes(location.pathname) && <ChatList />}
    </div>
  );
};

export default Layout;
