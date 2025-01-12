import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchNotifications,
  toggleNotificationSeen,
} from "../store/notificationSlice";
import { FaBell, FaEye, FaEyeSlash } from "react-icons/fa";
import NotificationItem from "./notificationSubComponents/NotificationItem";

const NotificationComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const dispatch: AppDispatch = useDispatch();
  const { notifications, loading } = useSelector(
    (state: RootState) => state.notifications,
  );

  const { token } = useSelector((state: RootState) => state.auth);

  const toggleDropdown = () => {
    if (!dragged) {
      setIsOpen(!isOpen);
      if (!isOpen && token) {
        dispatch(fetchNotifications(token));
      }
    }
    setDragged(false);
  };

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

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

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
        {notifications.some((n) => !n.attributes.was_seen) && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-blue-500 dark:bg-red-500"></span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute mt-2 bg-gray-400 dark:bg-gray-300 shadow-lg rounded-lg max-h-96 overflow-y-auto z-50 w-80"
          style={getDropdownPosition()}
        >
          <div className="p-4">
            {loading ? (
              <p>Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p>You don&apos;t have any notifications</p>
            ) : (
              notifications.map((notification) => (
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
