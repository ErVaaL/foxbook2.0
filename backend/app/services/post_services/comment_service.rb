module PostServices
  class CommentService < BasePostsService
    def get_post_comments(post, page, per_page)
      return post_not_found_error unless post
      comments = post.comments.order(created_at: :desc)
        .skip((page - 1) * per_page).limit(per_page)

      total_comments = post.comments.count
      total_pages = (total_comments / per_page.to_f).ceil
      { success: true,
        data: CommentSerializer.new(comments).serializable_hash,
        pagination: {
          current_page: page,
          per_page: per_page,
          total_comments: total_comments,
          total_pages: total_pages
      }, status: :ok }
    end

    def get_comment(comment)
      return comment_not_found_error unless comment
      { success: true, data: CommentSerializer.new(comment).serializable_hash, status: :ok }
    end

    def create_comment(post, comment_params)
      comment = post.comments.build(comment_params.merge(user: @current_user))
      return { success: false, error: "Failed to create comment", status: :bad_request } unless comment.save
      { success: true, data: CommentSerializer.new(comment).serializable_hash, status: :created }
    end

    def comment_update(comment, comment_params)
      return comment_not_found_error unless comment
      return not_the_same_user_error unless comment.user == @current_user || @current_user.admin?
      return { success: false, error: "Failed to update comment", messages: comment.errors.full_messages, status: :bad_request } unless comment.update(comment_params)
      { success: true, data: CommentSerializer.new(comment).serializable_hash, status: :ok }
    end

    def delete_comment(post, comment)
      return post_does_not_have_comment_error unless post.comments.include?(comment)
      return comment_not_found_error unless comment
      return not_the_same_user_error unless comment.user == @current_user || @current_user.admin?
      comment.destroy
      { success: true, data: "Comment deleted successfully", status: :no_content }
    end

    private

      def comment_not_found_error
        { success: false, error: "Comment not found", status: :not_found }
      end

      def post_does_not_have_comment_error
        { success: false, error: "No comment to delete", status: :not_found }
      end
  end
end
