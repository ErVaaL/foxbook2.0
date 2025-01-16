class EventSerializer
  include JSONAPI::Serializer
  attributes :title, :description, :event_date, :created_at

  attribute :host do |event|
    {
      id: event.user.id.to_s,
      avatar: event.user.avatar,
      username: event.user.username
    }
  end

  attribute :attendees do |event|
    event.attendees.map do |attendee|
      {
        id: attendee.id.to_s,
        avatar: attendee.avatar,
        username: attendee.username
      }
    end
  end
end
