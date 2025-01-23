class AdminServices::ReportsService < ApplicationService
  def get_all_reports(page, per_page)
    reports = Report.all.page(page).per(per_page)
    { success: true, reports: ReportSerializer.new(reports).serializable_hash, status: :ok }
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "Reports not found", status: :not_found }
  end

  def get_report(report)
    return { success: false, error: "Report not found", status: :not_found } if report.nil?
    { success: true, report: ReportSerializer.new(report).serializable_hash, status: :ok }
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "Report not found", status: :not_found }
  end

  def create_report(report_params)
    report = Report.new(report_params)
    { success: false, error: report.errors.full_messages.join(", "), status: :bad_request } unless report.save
    { success: true, report: ReportSerializer.new(report).serializable_hash, status: :created }
  end

  def close_report(report)
    return { success: false, error: "Report not found", status: :not_found } if report.nil?

    return { success: false, error: report.errors.full_messages.join(", "), status: :bad_request } unless report.update!(status: "closed")
    { success: true, message: "Report closed successfully", status: :ok }
  end
end
