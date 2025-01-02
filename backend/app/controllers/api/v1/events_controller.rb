class Api::V1::EventsController < ApplicationController
  before_action :authorize_request
  before_action :set_event, only: [ :show, :update, :destroy, :attendees, :attend, :unattend ]
  before_action :set_service

  def index
    result = @service.get_all_events
    render json: result.except(:status), status: result[:status]
  end

  def show
    result = @service.get_event(@event)
    render json: result.except(:status), status: result[:status]
  end

  def create
    event_params = needed_params(:event, [ :title, :description, :event_date ])
    result = @service.create_event(event_params)
    render json: result.except(:status), status: result[:status]
  end

  def update
    event_id =Event.find(params[:id])
    event_params = needed_params(:event, [ :title, :description, :event_date ])
    result = @service.update_event(event_id, event_params)
    render json: result.except(:status), status: result[:status]
  end

  def destroy
    event_id = params[:id]
    result = @service.delete_event(event_id)
    render json: result.except(:status), status: result[:status]
  end

  def attendees
    result = @service.check_attendees(@event)
    render json: result.except(:status), status: result[:status]
  end

  def attend
    result = @service.attend_event(@event)
    render json: result.except(:status), status: result[:status]
  end

  def unattend
    user_id = params[:user_id]
    result = @service.unattend_event(user_id, @event)
    render json: result.except(:status), status: result[:status]
  end

  private

    def set_event
      @event = Event.find(params[:id] || params[:event_id])
    rescue Mongoid::Errors::DocumentNotFound
      render json: { errors: "Event not found" }, status: :not_found
    end

    def set_service
      @service = initialize_service(EventServices::EventService)
    end
end
