import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import UniversalHeader from "../components/universal/UniversalHeader";
import UniversalBoard from "../components/universal/UniversalBoard";
import NotificationItem from "../components/notificationSubComponents/NotificationItem";
import { Notification, fetchNotifications } from "../store/notificationSlice";
import { AppDispatch } from "../store";

interface DisplayNotificationProps {
  notifications: Notification[];
  token: string;
  loading: boolean;
}

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading } = useSelector(
    (state: RootState) => state.notifications,
  );
  const { token, isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoggedIn && token) {
      dispatch(fetchNotifications(token));
    }
  }, [isLoggedIn, token, dispatch]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.attributes.was_seen).length,
    [notifications],
  );

  if (!isLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200 flex items-center flex-col gap-5">
        <h1 className="text-gray-700 dark:text-gray-300 mt-4">
          You are not logged in.
        </h1>
        <img
          src="https://http.cat/401"
          alt="You have to be logged in to view your notifications"
          className="w-9/12 h-9/12 dark:text-gray-300"
        />
      </div>
    );
  }

  const sections = [
    {
      label: "All",
      component: (
        <DisplayNotification
          notifications={[...notifications]
            .filter((n) => !n.attributes.content.action_taken)
            .sort(
              (a, b) =>
                new Date(b.attributes.created_at).getTime() -
                new Date(a.attributes.created_at).getTime(),
            )}
          token={token}
          loading={loading}
        />
      ),
    },
    {
      label: "Unread",
      component: (
        <DisplayNotification
          notifications={notifications.filter(
            (n) => !n.attributes.was_seen && !n.attributes.content.action_taken,
          )}
          token={token}
          loading={loading}
        />
      ),
    },
    {
      label: "Read",
      component: (
        <DisplayNotification
          notifications={notifications.filter(
            (n) => n.attributes.was_seen && !n.attributes.content.action_taken,
          )}
          token={token}
          loading={loading}
        />
      ),
    },
    {
      label: "Archival",
      component: (
        <DisplayNotification
          notifications={notifications.filter(
            (n) => n.attributes.content.action_taken,
          )}
          token={token}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <UniversalHeader
        title="Notifications"
        additionalInfo={`Unread: ${unreadCount}`}
        description="Manage and view your notifications."
      />
      <UniversalBoard sections={sections} />
    </div>
  );
};

export default Notifications;

const DisplayNotification: React.FC<DisplayNotificationProps> = ({
  notifications,
  token,
  loading,
}) => {
  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            token={token}
          />
        ))
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No notifications found.
        </p>
      )}
    </div>
  );
};
