import React, { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

const ReportActions: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = async (event: Event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;

      if (target.closest(".close-report")) {
        const reportId = target.getAttribute("data-report-id");
        if (!reportId) return;

        const confirmClose = window.confirm(
          "Are you sure you want to close this report?",
        );
        if (!confirmClose) return;

        try {
          await axios.patch(
            `${API_BASE_URL}${API_ENDPOINTS.REPORTS_CLOSE(reportId)}.json`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );

          const statusSpan = document.getElementById(
            `report-status-${reportId}`,
          );
          if (statusSpan) {
            statusSpan.textContent = "Closed";
            statusSpan.classList.remove("bg-red-500");
            statusSpan.classList.add("bg-green-500");
          }
        } catch (error) {
          console.error("Error closing report:", error);
        }
      }

      if (target.closest(".view-report")) {
        let postId = target.getAttribute("data-post-id");
        if (postId) {
          postId = postId.replace(/"/g, "");
          navigate("/", { state: { postId } });
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [navigate, token]);

  return null;
};

export default ReportActions;
