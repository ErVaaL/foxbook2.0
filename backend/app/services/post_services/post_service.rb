module PostServices
  class PostService < BasePostsService
    def get_all_posts
      posts = Post.all.order(created_at: :desc)
      { success: true, data: PostSerializer.new(posts).serializable_hash, status: :ok }
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, error: "Posts not found", status: :not_found }
    end

    def get_post(post)
      { success: true, data: PostSerializer.new(post).serializable_hash, status: :ok }
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, error: "Post not found", status: :not_found }
    end

    def create_post(current_user, post_params)
      post = Post.new(post_params)
      post.user = current_user
      Rails.logger.debug("\n Post: #{post.inspect} \n")
      return { success: false, error: "Failed to create post", status: :bad_request } unless post.save
      { success: true, data: PostSerializer.new(post).serializable_hash, status: :created }
    end

    def update_post(current_user, post, post_params)
      return { success: false, error: "Unauthorized to update post", status: :unauthorized } unless post.user == current_user
      return { success: false, error: "Failed to update post", messages: post.errors.full_messages, status: :bad_request } unless post.update(post_params)
      { success: true, data: PostSerializer.new(post).serializable_hash, status: :ok }
    end

    def delete_post(current_user, post)
      return post_not_found_error if post.nil?
      return not_the_same_user_error unless post.user_id == current_user.id
      post.comments.each(&:destroy)
      post.destroy
      { success: true, data: "Post deleted successfully", status: :no_content }
    end
  end
end
