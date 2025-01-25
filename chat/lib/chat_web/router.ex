defmodule ChatWeb.Router do
  use ChatWeb, :router

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/api", ChatWeb do
    pipe_through(:api)

    post("/messages", MessageController, :create)
    get("/messages", MessageController, :index)
    get("/messages/sender/:sender_id", MessageController, :get_by_sender)
  end
end
