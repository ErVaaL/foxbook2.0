class Api::V1::LikesController < ApplicationController
  before_action :authorize_request, except: [ :index ]
  before_action :set_service
  before_action :set_post, only: [ :create, :destroy ]

  def index
    result = @service.post_likes(@post)
    render json: result.except(:status), status: result[:status] || :ok
  end

  def create
    result = @service.like_post(@post)
    render json: result.except(:status), status: result[:status] || :created
  end

  def destroy
    user_id = params[:id]
    result = @service.unlike_post(user_id, @post)
    render json: result.except(:status), status: result[:status] || :no_content
  end

  private

    def set_service
      @service = initialize_service(PostServices::LikesService)
    end
end
