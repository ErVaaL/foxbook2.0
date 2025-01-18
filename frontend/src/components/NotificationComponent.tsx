import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchNotifications,
  toggleNotificationSeen,
} from "../store/notificationSlice";
import { FaBell } from "react-icons/fa";
import NotificationItem from "./notificationSubComponents/NotificationItem";
import useUnreadNotifications from "../hooks/useUnreadNotifications";
import { useNavigate } from "react-router-dom";

const NotificationComponent: React.FC = () => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 1550,
    y: 20,
  });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [dragged, setDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragged(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) {
        setDragged(true);

        const newX = Math.max(
          0,
          Math.min(window.innerWidth - 40, e.clientX - dragStart.x),
        );
        const newY = Math.max(
          0,
          Math.min(window.innerHeight - 40, e.clientY - dragStart.y),
        );

        setPosition({ x: newX, y: newY });
      }
    },
    [dragging, dragStart],
  );
  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleResize = useCallback(() => {
    const adjustedX = Math.min(position.x, window.innerWidth - 40);
    const adjustedY = Math.min(position.y, window.innerHeight - 40);
    setPosition({ x: adjustedX, y: adjustedY });
  }, [position]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove]);

  const dispatch: AppDispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { unreadNotifications, loading } = useUnreadNotifications();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    if (!dragged) {
      setIsOpen(!isOpen);
      if (!isOpen && token) {
        dispatch(fetchNotifications(token));
      }
    }
    setDragged(false);
  };

  const getDropdownPosition = () => {
    const dropdownWidth = 320;
    const dropdownHeight = 300;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const isOutOfLeft = position.x < dropdownWidth / 2;
    const isOutOfRight = position.x + dropdownWidth > viewportWidth;
    const isOutOfBottom = position.y + dropdownHeight > viewportHeight;

    return {
      left: isOutOfLeft ? 0 : isOutOfRight ? "auto" : 0,
      right: isOutOfRight ? 0 : "auto",
      top: isOutOfBottom ? "auto" : "100%",
      bottom: isOutOfBottom ? "100%" : "auto",
    };
  };

  const toggleSeen = (id: string) => {
    if (token) dispatch(toggleNotificationSeen({ id, token }));
  };

  const handleGoToNotifications = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 50,
      }}
    >
      <button
        onClick={toggleDropdown}
        onMouseDown={handleMouseDown}
        className="w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-500 text-white dark:bg-gray-600 dark:hover:bg-darkgoldenrod flex items-center justify-center relative cursor-move"
      >
        <FaBell />
        {unreadNotifications.some((n) => !n.attributes.was_seen) && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-blue-500 dark:bg-red-500"></span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute mt-2 bg-gray-400 dark:bg-gray-300 shadow-lg rounded-lg max-h-96 overflow-y-auto z-50 w-80"
          style={getDropdownPosition()}
        >
          <h3
            onClick={handleGoToNotifications}
            className="text-center p-1 font-bold hover:text-orange-300 dark:hover:text-goldenrodhover hover:cursor-pointer"
          >
            Go to your notifications
          </h3>
          <div className="p-4 transition-colors duration-200">
            {loading ? (
              <p className="text-white dark:text-gray-800">
                Loading notifications...
              </p>
            ) : unreadNotifications.length === 0 ? (
              <p className="text-white dark:text-gray-800">
                You don&apos;t have any notifications
              </p>
            ) : (
              unreadNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  token={token}
                  toggleSeen={toggleSeen}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
