class Api::V1::GroupsController < ApplicationController
  before_action :set_group, only: [ :show, :update, :destroy, :members, :add_member, :remove_member ]
  before_action :authorize_request, only: [ :create, :update, :destroy, :add_member, :remove_member ]


  def index
    groups = Group.all
    render json: groups.map { |group| GroupSerializer.new(group).serializable_hash }, status: :ok
  end

  def show
    render json: GroupSerializer.new(@group).serializable_hash, status: :ok
  end

  def create
    group = Group.new(needed_params(:group, [ :name, :description, :is_public ]))
    group.owner = @current_user

    Membership.create(group: group, user: @current_user, role: "owner")

    if group.save
      render json: GroupSerializer.new(group).serializable_hash, status: :created
    else
      render json: { error: "Failed to create group", details: group.errors.full_messages }, status: :bad_request
    end
  end

  def update
    if @group.owner != @current_user
      render json: { error: "Not group owner" }, status: :unauthorized
      return
    end
    if @group.update(needed_params(:group, [ :name, :description, :is_public ]))
      render json: GroupSerializer.new(@group).serializable_hash, status: :accepted
    else
      render json: { error: "Failed to update group", details: @group.errors.full_messages }, status: :bad_request
    end
  end

  def destroy
    if @group.owner != @current_user
      render json: { error: "Not group owner" }, status: :unauthorized
      return
    end
    Membership.where(group: @group).destroy_all
    @group.destroy
    render json: { message: "Group deleted" }, status: :accepted
  end

  def members
    memberships = @group.memberships.includes(:user)
    render json: memberships.map { |membership| MembershipSerializer.new(membership).serializable_hash }, status: :ok
  end

  def add_member
    user = User.find(params[:user_id])
    if Membership.where(group: @group, user: user).exists?
      render json: { error: "User already in group" }, status: :bad_request
      return
    end
    @group.add_member_to_group(user)

    render json: { message: "User added to group" }, status: :created
  end

  def remove_member
    user = User.find(params[:user_id])

    membership = Membership.where(group: @group, user: user).first
    unless membership
      render json: { error: "User not in group" }, status: :bad_request
      return
    end

    @group.remove_member_from_group(user)
    render json: { message: "User removed from group" }, status: :accepted
  end

  private

    def set_group
      @group = Group.find(params[:id] || params[:group_id])
    rescue Mongoid::Errors::DocumentNotFound
      render json: { error: "Group not found" }, status: :not_found
    end
end
