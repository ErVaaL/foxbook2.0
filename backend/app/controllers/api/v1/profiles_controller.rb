class Api::V1::ProfilesController < ApplicationController
  before_action :authorize_request
  before_action :set_user
  before_action :set_service

  def show
    result = @service.show
    render json: result, status: result[:success] ? :ok : :not_found
  end

  def update
    profile_params = needed_params(:profile, [ :description, :birthday, address: [ :country, :state, :city ] ])
    result = @service.update_profile(profile_params)
    render json: result, status: result[:success] ? :accepted : :bad_request
  end

  private

    def set_service
      @service = ProfileServices::ProfileService.new(@user)
    end
end
