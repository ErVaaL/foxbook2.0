class Api::V1::Admin::GroupsController < ApplicationController
  before_action :authorize_request
  before_action :authorize_admin
  before_action :set_service

  def index
    result  = @service.get_all_groups
    render json: result.except(:status), status: result[:status]
  end

  def show
    result = @service.get_group(params[:id])
    render json: result.except(:status), status: result[:status]
  end

  def update
    group_params = needed_params(:group, [ :name, :description, :is_public, :owner ])
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
