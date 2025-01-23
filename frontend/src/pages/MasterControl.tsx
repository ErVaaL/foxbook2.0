import React from "react";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import UniversalBoard from "../components/universal/UniversalBoard";
import UsersManagement from "../components/masterControlPanelSubComponents/UsersManagement";
import GroupsManagement from "../components/masterControlPanelSubComponents/GroupsManagement";
import EventsManagement from "../components/masterControlPanelSubComponents/EventsManagement";

const MasterControl: React.FC = () => {
  const { isLoggedIn, isAdmin } = useSelector((state: RootState) => state.auth);

  if (!isLoggedIn) {
    return (
      <NotAuthorized
        message="You need to be logged in to view this page"
        httpCat={401}
      />
    );
  }

  if (!isAdmin) {
    return (
      <NotAuthorized
        message="You are not authorized to view this page"
        httpCat={403}
      />
    );
  }

  const sections = [
    {
      label: "Users",
      component: <UsersManagement />,
    },
    {
      label: "Groups",
      component: <GroupsManagement />,
    },
    {
      label: "Events",
      component: <EventsManagement />,
    },
    {
      label: "Settings",
      component: <p>Settings</p>,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <UniversalBoard sections={sections} />
    </div>
  );
};

export default MasterControl;

type NotAuthorizedProps = {
  message: string;
  httpCat: number;
};

const NotAuthorized: React.FC<NotAuthorizedProps> = ({ message, httpCat }) => {
  const urlCat = `https://http.cat/${httpCat}`;
  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto p-4 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <p className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
        {message}
      </p>
      <img
        src={urlCat}
        alt="Unauthorized access"
        className="w-6/12 h-auto mt-4"
      />
    </div>
  );
};
