module EventServices
  class EventService < ApplicationService
    def get_all_events
      events = Event.all.order(event_date: :asc)
      { success: true, events: EventSerializer.new(events).serializable_hash, status: :ok }
    end

    def get_event(event)
      return { success: false,  errors: "Event not found", status: :not_found } if event.nil?
      { success: true, data: EventSerializer.new(event).serializable_hash, status: :ok }
    end

    def create_event(event_params)
      event = Event.new(event_params)
      event.user = @current_user
      event.attend(@current_user)
      return { success: false, data: { errors: event.errors.full_messages }, status: :unprocessable_entity } unless event.save
      { success: true, data: EventSerializer.new(event).serializable_hash, status: :created }
    end

    def update_event(event_id, event_params)
      event = Event.find(event_id)
      return { success: false, data: { errors: "Event not found" }, status: :not_found } if event.nil?
      return not_the_same_user_error unless event.user_id == @current_user.id || @current_user.admin?
      return { success: false, data: { errors: event.errors.full_messages }, status: :unprocessable_entity } unless event.update(event_params)
      { success: true, data: EventSerializer.new(event).serializable_hash, status: :accepted }
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, data: { errors: "Event not found" }, status: :not_found }
    end

    def delete_event(event_id)
      event = Event.find_by(id: event_id)
      return { success: false, data: { errors: "Event not found" }, status: :not_found } if event.nil?
      return not_the_same_user_error unless event.user_id == @current_user.id || @current_user.admin?
      return { success: false, data: { errors: event.errors.full_messages }, status: :unprocessable_entity } unless event.destroy
      { success: true, data: { message: "Event deleted" }, status: :no_content }
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, data: { errors: "Event not found" }, status: :not_found }
    end

    def check_attendees(event)
      return { success: false, data: { errors: "Event not found" }, status: :not_found } if event.nil?
      attendees = event.attendees
      { success: true, data: UserSerializer.new(attendees).serializable_hash, status: :ok }
    end

    def attend_event(event)
      return event_not_found_error if event.nil?
      return already_attending_error if event.attendees.include?(@current_user)
      event.attend(@current_user)
      { success: true, data: { message: "User is now attending event" }, status: :created }
    end

    def unattend_event(user_id, event)
      return event_not_found_error if event.nil?
      return no_such_attendee_error unless event.attendees.include?(@current_user)
      return not_the_same_user_error unless user_id === @current_user.id.to_s
      event.unattend(@current_user)
      { success: true, data: { message: "User no longer attending event" }, status: :no_content }
    end

    private

      def event_not_found_error
        { success: false, data: { errors: "Event not found" }, status: :not_found }
      end

      def already_attending_error
        { success: false, data: { errors: "User is already attending event" }, status: :conflict }
      end

      def no_such_attendee_error
        { success: false, data: { errors: "User is already not attending event" }, status: :not_found }
      end
  end
end
