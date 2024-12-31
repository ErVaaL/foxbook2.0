class Api::V1::LikesController < ApplicationController
  before_action :authorize_request, except: [ :index ]
  before_action :set_post, only: [ :create, :destroy ]

  def index
    if !@post.nil?
      likes = @post.likes
      render json: UserSerializer.new(likes).serializable_hash, status: :ok
    else
      render json: { error: "Post not found" }, status: :not_found
    end
  end

  def create
    if @post.nil?
      render json: { error: "Post not found" }, status: :not_found
      return
    end
    if @post.liked_by?(@current_user.id)
      render json: { error: "Post already liked" }, status: :bad_request
      return
    end
    @post.like!(@current_user)
    render json: { message: "Post liked successfully" }, status: :created
  end

  def destroy
    if @post.nil?
      render json: { error: "Post not found" }, status: :not_found
      return
    end
    if !@post.liked_by?(@current_user.id)
      render json: { error: "Post already unliked" }, status: :not_found
      return
    end
    @post.unlike!(@current_user)
    render json: { message: "Post unliked successfully" }, status: :no_content
  end
end
