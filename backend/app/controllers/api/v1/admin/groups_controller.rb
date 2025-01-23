class Api::V1::Admin::GroupsController < ApplicationController
  before_action :authorize_request
  before_action :authorize_admin
  before_action :set_service

  def index
    page = params[:page].presence || 1
    per_page = params[:per_page].presence || 10
    result  = @service.get_all_groups(page.to_i, per_page.to_i)
    render json: result.except(:status), status: result[:status]
  end

  def show
    result = @service.get_group(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  def update
    group_params = needed_params(:groups, [ :name, :description, :is_public, :owner ])
    result = @service.group_update(params[:id], group_params)
    render json: result.except(:status), status: result[:status]
  end

  def destroy
    result = @service.group_delete(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(AdminServices::GroupsService)
    end
end
