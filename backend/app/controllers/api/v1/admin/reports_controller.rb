class Api::V1::Admin::ReportsController < ApplicationController
  before_action :authorize_request
  before_action :authorize_admin
  before_action :set_service

  private

    def set_service
    end
end
