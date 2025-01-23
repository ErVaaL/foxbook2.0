class AdminServices::GroupsService < ApplicationService
  def initialize(current_user)
    super(current_user)
    @group_service = initialize_service(GroupServices::GroupService)
  end

  def get_all_groups(page = 1, per_page = 10)
    groups = Group.order_by(created_at: :desc).page(page).per(per_page)
    { success: true,
      groups: GroupSerializer.new(groups).serializable_hash,
      meta: { total_count: groups.count, current_page: page, per_page: per_page },
      status: :ok }
  rescue Mongoid::Errors::DocumentNotFound
    { success: false, error: "Groups not found", status: :not_found }
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
