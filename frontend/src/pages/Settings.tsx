import React, { useEffect } from "react";
import UniversalBoard from "../components/universal/UniversalBoard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchSettings, updateSettings } from "../store/settingsSlice";
import SettingsForm from "../forms/SettingsForm";

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId, token, isLoggedIn } = useSelector(
    (state: RootState) => state.auth,
  );
  const settings = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    if (userId && token) {
      dispatch(fetchSettings());
    }
  }, [userId, token, dispatch]);

  const handleSettingsSubmit = async (values: any) => {
    if (userId && token) {
      const response = await dispatch(updateSettings(values));
      return response.meta.requestStatus === "fulfilled";
    }
    return false;
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
        <p className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
          You need to be logged in to view this page
        </p>
        <img
          src="https://http.cat/401"
          alt="Not logged in"
          className="w-full h-auto mt-4"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <UniversalBoard
        sections={[
          {
            label: "General",
            component: (
              <SettingsForm
                onSubmit={handleSettingsSubmit}
                initialValues={settings}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default Settings;
