class Api::V1::SearchController < ApplicationController
  skip_before_action :authorize_request, only: :index
  before_action :set_service

  def index
    result = @service.call
    render json: result.except(:status), status: result[:status]
  rescue StandardError => e
    render json: { success: false, error: e.message, status: :internal_server_error }, status: :internal_server_error
  end

  private

    def set_service
      query = params[:query]
      @service = initialize_service(SearchServices::SearchService, query)
    end
end
