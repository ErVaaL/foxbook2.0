defmodule ChatWeb.Router do
  use ChatWeb, :router

  alias ChatWeb.Plugs.AuthPlug

  pipeline :api do
    plug(:accepts, ["json"])
  end

  pipeline :auth do
    plug(AuthPlug)
  end

  scope "/api", ChatWeb do
    pipe_through([:api, :auth])

    post("/messages", MessageController, :create)
    get("/messages", MessageController, :index)
    get("/messages/conversation/:sender_id", MessageController, :get_conversation)
  end
end
