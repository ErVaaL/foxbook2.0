class Api::V1::PostsController < ApplicationController
  before_action :authorize_request, except: [ :index, :show ]
  before_action :set_post, only: [ :show, :update, :destroy, :share ]

  def index
    posts = Post.all.order(created_at: :desc)
    render json: PostSerializer.new(posts).serializable_hash, status: :ok
  end

  def show
    render json: PostSerializer.new(@post).serializable_hash, status: :ok
  end

  def create
    post = @current_user.posts.build(needed_params(:posts, [ :title, :contents ]))
    if post.save
      render json: PostSerializer.new(post).serializable_hash, status: :created
    else
      render json: { error: "Failed to create post", messages: post.errors.full_messages }, status: :bad_request
    end
  end

  def update
    if @post.update(needed_params(:posts, [ :title, :contents ]))
      render json: PostSerializer.new(@post).serializable_hash, status: :ok
    else
      render json: { error: "Failed to update post", messages: @post.errors.full_messages }, status: :bad_request
    end
  end

  def destroy
    if @post.nil?
      render json: { error: "Post not found" }, status: :not_found
      return
    end
    if !@post.user != @current_user
      render json: { error: "Unauthorized to delete post" }, status: :unauthorized
      return
    end

    @post.comments.each do |comment|
      comment.destroy
    end

    @post.destroy
    render json: { message: "Post deleted successfully" }, status: :no_content
  end

  def share
    # TODO
  end
end
