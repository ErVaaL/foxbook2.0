import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import axios from "axios";

const ReportsManagement: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>("Loading...");
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}${API_ENDPOINTS.REPORTS}.html`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setHtmlContent(response.data);
      })
      .catch((error) => {
        setHtmlContent(`Error loading reports: ${error.message}`);
      });
  }, [token]);

  return (
    <div className="reports-container">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default ReportsManagement;
