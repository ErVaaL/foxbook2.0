import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Notification } from "../store/notificationSlice";

const useUnreadNotifications = () => {
  const { notifications, loading } = useSelector(
    (state: RootState) => state.notifications,
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((n: Notification) => !n.attributes.was_seen),
    [notifications],
  );

  return { unreadNotifications, loading };
};

export default useUnreadNotifications;
