module ProfileServices
  class ProfileService
    def initialize(user)
      @user = user
    end

    def show
      profile = @user.profile
      if profile
        { success: true, details: ProfileSerializer.new(profile).serializable_hash }
      else
        { success: false, error: "Profile not found" }
      end
    end

    def update_profile(profile_params)
      profile = @user.profile
      if profile.update(profile_params)
        { success: true, message: "Profile successfully updated", details: ProfileSerializer.new(profile).serializable_hash }
      else
        { success: false, error: "Failed to update profile", details: profile.errors.full_messages }
      end
    end
  end
end
