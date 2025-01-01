class Api::V1::LikesController < ApplicationController
  before_action :authorize_request, except: [ :index ]
  before_action :set_service
  before_action :set_post, only: [ :create, :destroy ]

  def index
    result = @service.post_likes(@post)
    render json: result.except(:status), status: result[:status]
  end

  def create
    result = @service.like_post(@current_user, @post)
    render json: result.except(:status), status: result[:status]
  end

  def destroy
    user_id = params[:id]
    result = @service.unlike_post(@current_user, user_id, @post)
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(PostServices::LikesService)
    end
end
