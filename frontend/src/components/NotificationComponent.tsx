import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchNotifications, markAsSeen } from "../store/notificationSlice";
import { FaBell } from "react-icons/fa";

const NotificationComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const { notifications, loading } = useSelector(
    (state: RootState) => state.notifications,
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      dispatch(fetchNotifications());
    }
  };

  const handleMarkAsSeen = (id: string) => dispatch(markAsSeen(id));

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-500 text-white dark:bg-gray-600 dark:hover:bg-darkgoldenrod flex items-center justify-center relative"
      >
        <FaBell />
        {notifications.some((n) => !n.was_seen) && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-400 dark:bg-gray-300 shadow-lg rounded-lg max-h-96 overflow-y-auto z-50">
          <div className="p-4">
            {loading ? (
              <p>Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p>You don&apos;t have any notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b ${
                    notification.was_seen
                      ? "bg-gray-100"
                      : "bg-blue-100 font-bold"
                  }`}
                >
                  <p>{notification.content.message}</p>
                  {!notification.was_seen && (
                    <button
                      onClick={() => handleMarkAsSeen(notification.id)}
                      className="text-blue-500 text-sm mt-2"
                    >
                      Mark as seen
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
