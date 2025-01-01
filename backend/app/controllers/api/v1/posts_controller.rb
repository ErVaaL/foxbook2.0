class Api::V1::PostsController < ApplicationController
  before_action :authorize_request, except: [ :index, :show ]
  before_action :set_post, only: [ :show, :update, :destroy, :share ]
  before_action :set_service

  def index
    result = @service.get_all_posts
    render json: result.except(:status), status: result[:status]
  end

  def show
    result = @service.get_post(@post)
    render json: result.except(:status), status: result[:status]
  end

  def create
    post_params = needed_params(:posts, [ :title, :contents ])
    result = @service.create_post(@current_user, post_params)
    render json: result.except(:status), status: result[:status]
  end

  def update
    post_params = needed_params(:posts, [ :title, :contents ])
    result = @service.update_post(@current_user, @post, post_params)
    render json: result.except(:status), status: result[:status]
  end

  def destroy
    result = @service.delete_post(@current_user, @post)
    render json: result.except(:status), status: result[:status]
  end

  def share
    # TODO
  end

  private

    def set_service
      @service = initialize_service(PostServices::PostService)
    end
end
