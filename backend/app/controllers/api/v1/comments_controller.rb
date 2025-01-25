class Api::V1::CommentsController < ApplicationController
  before_action :authorize_request, except: [ :index, :show ]
  before_action :set_post
  before_action :set_comment, except: [ :index, :create ]
  before_action :set_service

  def index
    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = (params[:per_page] || 10).to_i

    result = @service.get_post_comments(@post, page, per_page)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def show
    result = @service.get_comment(@comment)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def create
    comment_params = needed_params(:comments, [ :content ])
    result = @service.create_comment(@post, comment_params)
    render json: result.except(:status), status: result[:status] || :created
  end

  def update
    comment_params = needed_params(:comments, [ :content ])
    result = @service.comment_update(@comment, comment_params)
    render json: result.except(:status), status: result[:status] || :accepted
  end

  def destroy
    result = @service.delete_comment(@post, @comment)
    render json: result.except(:status), status: result[:status] || :no_content
  end

  private

    def set_comment
      @comment = @post.comments.where(id: params[:id]).first
    rescue Mongoid::Errors::DocumentNotFound
      render json: { error: "Comment not found" }, status: :not_found
    end

    def set_service
      @service = initialize_service(PostServices::CommentService)
    end
end
