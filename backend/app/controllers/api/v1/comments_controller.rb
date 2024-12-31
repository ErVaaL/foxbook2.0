class Api::V1::CommentsController < ApplicationController
  before_action :authorize_request, except: [ :index, :show ]
  before_action :set_post
  before_action :set_comment, except: [ :index, :create ]

  def index
    comments = @post.comments.order(created_at: :desc)
    render json: CommentSerializer.new(comments).serializable_hash, status: :ok
  end

  def show
    render json: CommentSerializer.new(@comment).serializable_hash, status: :ok
  end

  def create
    comment = @post.comments.build(needed_params(:comments, [ :content ]).merge(user: @current_user))
    if comment.save
      render json: CommentSerializer.new(comment).serializable_hash, status: :created
    else
      render json: { error: "Failed to create comment", messages: comment.errors.full_messages }, status: :bad_request
    end
  end

  def update
    if @comment.update(needed_params(:comments, [ :content ]))
      render json: CommentSerializer.new(@comment).serializable_hash, status: :ok
    else
      render json: { error: "Failed to update comment", messages: @comment.errors.full_messages }, status: :bad_request
    end
  end

  def destroy
    if @post.comments.include?(@comment)
      @comment.destroy
      render json: { message: "Comment deleted successfully" }, status: :no_content
    else
      render json: { error: "No comment to delete" }, status: :not_found
    end
  end

  private

    def set_comment
      @comment = @post.comments.where(id: params[:id]).first
    rescue Mongoid::Errors::DocumentNotFound
      render json: { error: "Comment not found" }, status: :not_found
    end
end
