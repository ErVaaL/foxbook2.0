import { useMemo } from "react";
import { Notification } from "../store/notificationSlice";

const useUnreadNotifications = (notifications: Notification[]) => {
  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.attributes.was_seen),
    [notifications],
  );

  return { unreadNotifications };
};

export default useUnreadNotifications;
