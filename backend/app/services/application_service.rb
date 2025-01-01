class ApplicationService
  protected
    def user_not_found_error
      { success: false, error: "User not found", status: :not_found }
    end

    def not_the_same_user_error
      { success: false, error: "You are not authorized to perform this action", status: :unauthorized }
    end
end
