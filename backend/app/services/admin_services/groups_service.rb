class AdminServices::GroupsService < ApplicationService
  def initialize(current_user)
    super(current_user)
    @group_service = initialize_service(GroupServices::GroupService)
  end

  def get_all_groups
    @group_service.get_all_groups
  end

  def get_group(group_id)
    group = Group.find(group_id)
    @group_service.get_group(group)
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "Group not found", status: :not_found }
  end

  def group_update(group_id, group_params)
    group = Group.find(group_id)
    @group_service.update_group(group, group_params)
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "Group not found", status: :not_found }
  end

  def group_delete(group_id)
    group = Group.find(group_id)
    @group_service.delete_group(group)
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "Group not found", status: :not_found }
  end
end
