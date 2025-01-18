import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { validateToken, fetchUserData } from "./store/authSlice";
import { initializeNotifications } from "./store/notificationSlice";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, token, user } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn && token && user?.id) {
      dispatch(fetchUserData(token));
      dispatch(initializeNotifications(token, user.id));
    }
  }, [dispatch, isLoggedIn, token, user?.id]);

  return <AppRouter />;
};

export default App;
