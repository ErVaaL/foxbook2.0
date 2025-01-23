export interface AdminEventFromAPI {
  id: string;
  attributes: {
    title: string;
    description: string;
    event_date: string;
    created_at: string;
    host: Host;
    attendees: Attendee[];
  };
}

interface Host {
  id: string;
  username: string;
  avatar: string;
}

interface Attendee {
  id: string;
  username: string;
  avatar: string;
}
