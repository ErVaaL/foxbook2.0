Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      # User routes
      post "/users/register", to: "users#create"
      post "/auth/login", to: "auth#login"
      delete "/auth/logout", to: "auth#logout"

      resources :users do
        member do
          get :posts
          get :groups
          get :events
        end
        resource :profile, only: [ :show, :update ]
        resource :settings, only: [ :show, :update ]
        resource :preferences, only: [ :show, :update ]
        resource :friends, only: [ :show, :destroy ] do
          collection do
            get :recieved_friend_requests
            get :sent_friend_requests
          end
        end
      end

      resources :notifications, only: [ :index ] do
        member do
          patch :switch_read_status
        end
      end

      # TODO
      # get "/users/:id/activity", to: "users#activity"

      # Friends routes
      resources :friends, only: [ :index, :create, :update, :destroy ], controller: "friend_requests"

      # TODO Message routes
      resources :messages, only: [ :index, :show ]

      # Group routes
      resources :groups, only: [ :index, :show, :create, :update, :destroy ] do
        get :members
        post :members, to: "groups#add_member", as: :add_member
        delete "members/:user_id", to: "groups#remove_member", as: :remove_member
        get :member_count, on: :member
      end

      # Post routes
      resources :posts, only: [ :index, :show, :create, :update, :destroy ] do
        resources :comments, only: [ :index, :create, :update, :destroy ]
        resources :likes, only: [ :index, :create, :destroy ]
        get :share, on: :member
      end

      # Event routes
      resources :events, only: [ :index, :show, :create, :update, :destroy ] do
        get :attendees, on: :member
        post :attendees, to: "events#attend", as: :attend
        delete "attendees/:user_id", to: "events#unattend", as: :unattend
      end

      get "/search", to: "search#index"

      # Admin routes
      namespace :admin do
        resources :users, only: [ :index, :show, :update, :destroy ]
        resources :content, only: [ :index, :show, :update, :destroy ]
        resources :groups, only: [ :index, :show, :update, :destroy ]
        # TODO
        resources :reports, only: [ :index ]
      end

      # Additional routes
      # ask about
      get "/settings/:id", to: "settings#show"

      post "/social/share", to: "social#share"
      post "/social/follow", to: "social#follow"

      get "/reports", to: "reports#index"
      get "/forums/:id/moderate", to: "forums#moderate"
      get "/history/changes", to: "history#changes"
      get "/analytics", to: "analytics#index"
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
