class Api::V1::ReportsController < ApplicationController
  before_action :authorize_request
  before_action :authorize_admin, only: [ :index, :show ]
  before_action :set_service
  before_action :set_report, only: [ :show, :close ]

  def index
    result = @service.get_all_reports(params[:page], params[:per_page])
    render json: result.except(:status), status: result[:status]
  end

  def show
    result = @service.get_report(@report)
    render json: result.except(:status), status: result[:status]
  end

  def create
    report_params = needed_params(:reports, [ :reported_user_id, :type, :reason, :post_id, :comment_id ])
    result = @service.create_report(report_params)
    render json: result.except(:status), status: result[:status]
  end

  def close
    return render json: { success: false, error: "Report not found", status: :not_found } unless @report
    result = @service.close_report(@report)
    render json: result.except(:status), status: result[:status]
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
