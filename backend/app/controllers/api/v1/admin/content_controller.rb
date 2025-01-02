class Api::V1::Admin::ContentController < ApplicationController
  before_action :authorize_request
  before_action :authorize_admin
  before_action :set_content_type, only: [ :index, :show, :update, :destroy ]
  before_action :set_service

  def index
    result = @service.get_all_content(@content_type, params[:post_id])
    render json: result.except(:status), status: result[:status]
  rescue Mongoid::Errors::DocumentNotFound
    result = { success: false, error: "Post not found", status: :not_found }
    render json: result.except(:status), status: result[:status]
  end

  def show
    result = @service.get_content(@content_type, params[:id], post_id: params[:post_id])
    render json: result.except(:status), status: result[:status]
  end

  def update
    result = @service.update_content(@content_type, params[:id], content_params)
    render json: result.except(:status), status: result[:status]
  end

  def destroy
    result = @service.delete_content(@content_type, params[:id])
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(AdminServices::ContentsService)
    end

    def set_content_type
      case params[:type]
      when ->(type) { type == "posts" }
        @content_type = Post
      when ->(type) { type == "comments" }
        @content_type = Comment
      when ->(type) { type == "events" }
        @content_type = Event
      else
        render json: { success: false, error: "Invalid resource", status: :bad_request }
      end
    end

    def content_params
      case @content_type
      when ->(type) { type == Post }
        needed_params(:posts, [ :title, :contents, :user_id ])
      when ->(type) { type == Comment }
        needed_params(:comments, [ :content ])
      when ->(type) { type == Event }
        needed_params(:event, [ :title, :description, :event_date, :user_id ])
      else
        {}
      end
    end
end
