import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useDispatch } from "react-redux";
import { validateToken } from "./store/authSlice";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  return <AppRouter />;
};

export default App;
