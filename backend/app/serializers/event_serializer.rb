class EventSerializer
  include JSONAPI::Serializer
  attributes :title, :description, :event_date

  attribute :host do |event|
    {
      id: event.user.id.to_s,
      username: event.user.username
    }
  end

  attribute :attendees do |event|
    event.attendees.map do |attendee|
      {
        id: attendee.id.to_s,
        username: attendee.username
      }
    end
  end
end
