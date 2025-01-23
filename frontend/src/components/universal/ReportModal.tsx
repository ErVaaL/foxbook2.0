import React from "react";

type ReportModalProps = {
  reportType: string;
  reportReason: string;
  setReportReason: (value: string) => void;
  setReportType: (value: string) => void;
  setShowReportModal: (value: boolean) => void;
  handleReportSubmit: (e: React.FormEvent) => void;
};

const ReportModal: React.FC<ReportModalProps> = ({
  reportType,
  reportReason,
  setReportReason,
  setReportType,
  setShowReportModal,
  handleReportSubmit,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#2e2e2e] p-6 rounded-lg shadow-lg">
        <h2 className="dark:text-gray-200 font-bold text-xl">Report Post</h2>
        <form onSubmit={handleReportSubmit} className="mt-4">
          <label className="block dark:text-gray-300 text-sm font-semibold">
            Report Type:
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-2 border rounded mt-1 dark:bg-[#1e1e1e] dark:text-gray-300"
          >
            <option value="inappropriate_content">Inappropriate Content</option>
            <option value="bullying">Bullying</option>
            <option value="toxic_behaviour">Toxic Behaviour</option>
          </select>

          <label className="block dark:text-gray-300 text-sm font-semibold mt-2">
            Reason (optional):
          </label>
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full p-2 border rounded mt-1 dark:bg-[#1e1e1e] dark:text-gray-300"
            rows={3}
          ></textarea>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowReportModal(false)}
              className="bg-gray-300 hover:bg-gray-500 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
