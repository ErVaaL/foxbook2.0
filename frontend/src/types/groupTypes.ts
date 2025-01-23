export interface AdminGroupFromAPI {
  id: string;
  attributes: {
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    is_public: boolean;
    owner: Owner;
  };
}

interface Owner {
  id: string;
  username: string;
  email: string;
}
