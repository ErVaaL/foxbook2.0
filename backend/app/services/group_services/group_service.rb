module GroupServices
  class GroupService < ApplicationService
    def get_all_groups
      groups = Group.all
      { success: true, details: groups.map { |group| GroupSerializer.new(group).serializable_hash }, status: :ok }
    end

    def get_group(group)
      return no_group_error if group.nil?
      { success: true, details: GroupSerializer.new(group).serializable_hash, status: :ok }
    end

    def create_group(group_params)
      group = Group.new(group_params)
      group.owner = user

      Membership.create(group: group, user: user, role: "owner")

      return { success: false, error: "Failed to create group", details: group.errors.full_messages, status: :bad_request } unless group.save

      { success: true, details: GroupSerializer.new(group).serializable_hash, status: :created }
    end

    def update_group(group, group_params)
      return no_group_error if group.nil?
      return not_group_owner_error unless group.owner_id == @current_user.id || @current_user.admin?

      return { success: false, error: "Failed to update group", details: group.errors.full_messages, status: :bad_request } unless group.update(group_params)
      { success: true, details: GroupSerializer.new(group).serializable_hash, status: :accepted }
    end

    def delete_group(group)
      return no_group_error if group.nil?
      return not_group_owner_error if group.owner_id != @current_user.id || @current_user.admin?

      { success: false, message: "Failed to delete group", details: group.errors.full_messages, status: :bad_request } unless group.destroy
      { success: true, message: "Group deleted successfully", status: :no_content }
    end

    def get_members(group)
      return no_group_error if group.nil?
      memberships = group.memberships.includes(:user)
      { success: true, details: memberships.map { |membership| MembershipSerializer.new(membership).serializable_hash }, status: :ok }
    end

    def get_member_count(group)
      return no_group_error if group.nil?
      { success: true, details: group.memberships.count, status: :ok }
    end

    def add_group_member(group, user)
      return no_group_error if group.nil?
      return user_not_found_error if user.nil?
      return { success: false, error: "User already in group", status: :bad_request } if Membership.where(group: group, user: user).exists?

      group.add_member_to_group(user)
      { success: true, message: "User added to group", status: :created }
    end

    def remove_group_member(group, user)
      return no_group_error if group.nil?
      return user_not_found_error if user.nil?

      membership = Membership.where(group: group, user: user).first
      return { success: false, error: "User not in group", status: :bad_request } unless membership

      group.remove_member_from_group(user)
      { success: true, message: "User removed from group", status: :accepted }
    end

    private

      def no_group_error
        { success: false, error: "Group not found", status: :not_found }
      end

      def not_group_owner_error
        { success: false, error: "Not group owner", status: :unauthorized }
      end
  end
end
