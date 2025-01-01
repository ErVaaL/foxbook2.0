module PostServices
  class BasePostsService < ApplicationService
    def post_already_liked_error
      { success: false, error: "Post already liked", status: :conflict }
    end

    def post_not_found_error
      { success: true, error: "Post not found", status: :not_found }
    end

    def post_not_liked_error
      { success: false, error: "Post not liked", status: :not_found }
    end
  end
end
