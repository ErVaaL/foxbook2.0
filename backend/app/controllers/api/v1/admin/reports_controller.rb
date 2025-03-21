class Api::V1::Admin::ReportsController < ApplicationController
  include ActionController::MimeResponds

  before_action :authorize_request
  before_action :authorize_admin, only: [ :index, :show ]
  before_action :set_service
  before_action :set_report, only: [ :show, :close ]

  def index
    @reports = Report.order(created_at: :desc).page(params[:page]).per(10)
    respond_to do |format|
      format.html { render :index, layout: "application" }
      format.turbo_stream
    end
  end

  def show
    respond_to do |format|
      format.html
      format.turbo_stream { render turbo_stream: turbo_stream.replace("report_details", partial: "reports/show", locals: { report: @report }) }
    end
  end

  def create
    report_params = needed_params(:reports, [ :reported_user_id, :type, :reason, :post_id, :comment_id ])
    report_params[:reporter_id] = @current_user.id
    result = @service.create_report(report_params)
    render json: result.except(:status), status: result[:status]
  end

  def close
    @report.update!(status: "closed")

    respond_to do |format|
      format.json { render json: { success: true, message: "Report closed successfully", report: @report }, status: :ok }
      format.turbo_stream { render turbo_stream: turbo_stream.replace("report_#{@report.id}", partial: "reports/report", locals: { report: @report }) }
    end
  end


  private

    def set_service
      @service = initialize_service(AdminServices::ReportsService)
    end

    def set_report
      @report = Report.find(params[:id])
    rescue Mongoid::Errors::DocumentNotFound
      render json: { success: false, error: "Report not found", status: :not_found }
    end
end
