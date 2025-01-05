class Api::V1::ProfilesController < ApplicationController
  before_action :authorize_request, only: [ :update ]
  before_action :set_user
  before_action :set_service

  def show
    result = @service.show
    render json: result.except(:status), status: result[:status]
  end

  def update
    profile_params = needed_params(:profile, [ :description, address: [ :country, :state, :city ] ])
    result = @service.update_profile(profile_params)
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_service
      @service = initialize_service(ProfileServices::ProfileService, user: @user)
    end
end
