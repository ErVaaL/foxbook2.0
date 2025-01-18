import React, { useEffect } from "react";
import UniversalBoard from "../components/universal/UniversalBoard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchSettings, updateSettings } from "../store/settingsSlice";
import SettingsForm from "../forms/SettingsForm";

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId, token } = useSelector((state: RootState) => state.auth);
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
