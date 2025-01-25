class Api::V1::GroupsController < ApplicationController
  before_action :set_group, except: [ :index, :create ]
  before_action :authorize_request, except: [ :index, :show, :members, :member_posts, :member_events, :member_count ]
  before_action :set_service


  def index
    set_optional_user
    result = @service.get_all_groups(@current_user)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def show
    render json: GroupSerializer.new(@group).serializable_hash, status: :ok
  end

  def create
    group_params = needed_params(:group, [ :name, :description, :is_public ])
    result = @service.create_group(group_params)
    render json: result.except(:status), status: result[:status] || :created
  end

  def update
    group_params = needed_params(:group, [ :name, :description, :is_public ])
    result = @service.update_group(@group, group_params)
    render json: result.except(:status), status: result[:status] || :accepted
  end

  def destroy
    result = @service.delete_group(@group)
    render json: result.except(:status), status: result[:status] || :no_content
  end

  def members
    result = @service.get_members(@group)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def member_posts
    result = @service.get_member_posts(@group)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def member_events
    result = @service.get_member_events(@group)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def is_member
    result = @service.is_member(@group, @current_user.id)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def member_count
    result = @service.get_member_count(@group)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def add_member
    begin
      user = User.find(params[:user_id])
    rescue Mongoid::Errors::DocumentNotFound
      render json: { success: false, error: "User not found" }, status: :not_found
    end
    result = @service.add_group_member(@group, user)
    render json: result.except(:status), status: result[:status] || :created
  end

  def remove_member
    user = User.find(params[:user_id])
    result = @service.remove_group_member(@group, user)
    render json: result.except(:status), status: result[:status] || :no_content
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
