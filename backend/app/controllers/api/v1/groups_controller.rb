class Api::V1::GroupsController < ApplicationController
  before_action :set_group, only: [ :show, :update, :destroy, :members, :add_member, :remove_member, :member_count ]
  before_action :authorize_request, only: [ :create, :update, :destroy, :add_member, :remove_member ]
  before_action :set_service


  def index
    result = @service.get_all_groups
    render json: result.except(:status), status: result[:status]
  end

  def show
    render json: GroupSerializer.new(@group).serializable_hash, status: :ok
  end

  def create
    group_params = needed_params(:group, [ :name, :description, :is_public ])
    result = @service.create_group(group_params)
    render json: result.except(:status), status: result[:status]
  end

  def update
    group_params = needed_params(:group, [ :name, :description, :is_public ])
    result = @service.update_group(@group, group_params)
    render json: result.except(:status), status: result[:status]
  end

  def destroy
    result = @service.delete_group(@group)
    render json: result.except(:status), status: result[:status]
  end

  def members
    result = @service.get_members(@group)
    render json: result.except(:status), status: result[:status]
  end

  def member_count
    result = @service.get_member_count(@group)
    render json: result.except(:status), status: result[:status]
  end

  def add_member
    user = User.find(params[:user_id])
    result = @service.add_group_member(@group, user)
    render json: result.except(:status), status: result[:status]
  end

  def remove_member
    user = User.find(params[:user_id])
    result = @service.remove_group_member(@group, user)
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_group
      @group = Group.find(params[:id] || params[:group_id])
    rescue Mongoid::Errors::DocumentNotFound
      render json: { error: "Group not found" }, status: :not_found
    end

    def set_service
      @service = initialize_service(GroupServices::GroupService)
    end
end
