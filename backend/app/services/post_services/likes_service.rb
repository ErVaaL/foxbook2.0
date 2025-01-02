module PostServices
  class LikesService < BasePostsService
    def post_likes(post)
      return post_not_found_error if post.nil?
      { success: true, data: UserSerializer.new(post.likes).serializable_hash, status: :ok }
    end

    def like_post(post)
      return post_not_found_error if post.nil?
      return post_already_liked_error if post.liked_by?(@current_user.id)
      post.like!(@current_user)
      { success: true,  message: "Post liked successfully", status: :created }
    end

    def unlike_post(user_id, post)
      return post_not_found_error if post.nil?
      return post_not_liked_error unless post.liked_by?(@current_user.id)
      return not_the_same_user_error unless user_id == @current_user.id
      post.unlike!(@current_user)
      { success: true, message: "Post unliked successfully", status: :no_content }
    end
  end
end
