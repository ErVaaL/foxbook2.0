class Api::V1::EventsController < ApplicationController
  before_action :authorize_request
  before_action :set_event, only: [ :show, :update, :destroy, :attendees, :attend, :unattend ]

  def index
    @events = Event.all.order(event_date: :asc)
    render json: EventSerializer.new(@events).serializable_hash, status: :ok
  end

  def show
    render json: EventSerializer.new(@event).serializable_hash, status: :ok
  end

  def create
    event = Event.new(needed_params(:event, [ :title, :description, :event_date ]))
    event.user = @current_user

    if event.save
      render json: EventSerializer.new(event).serializable_hash, status: :created
    else
      render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    event =Event.find(params[:id])

    if event.nil?
      render json: { errors: "Event not found" }, status: :not_found
      return
    end

    if @event.update(needed_params(:event, [ :title, :description, :event_date ]))
      render json: EventSerializer.new(@event).serializable_hash, status: :ok
    else
      render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    event = @current_user.events.find(params[:id])

    if event.nil?
      render json: { errors: "Event not found" }, status: :not_found
      return
    end

    if @event.destroy
      render json: { message: "Event deleted" }, status: :no_content
    else
      render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def attendees
    attendees = @event.attendees
    render json: UserSerializer.new(attendees).serializable_hash, status: :ok
  end

  def attend
    if @event.attendees.include?(@current_user)
      render json: { errors: "User is already attending event" }, status: :bad_request
      return
    end

    @event.attendees << @current_user
    @event.save
    render json: { message: "User attending event" }, status: :created
  end

  def unattend
    if !@event.attendees.include?(@current_user)
      render json: { errors: "User is already not attending event" }, status: :bad_request
      return
    end

    @event.attendees.delete(@current_user)
    @event.save
    render json: { message: "User no longer attending event" }, status: :no_content
  end

  private

    def set_event
      @event = Event.find(params[:id] || params[:event_id])
    rescue Mongoid::Errors::DocumentNotFound
      render json: { errors: "Event not found" }, status: :not_found
    end
end
