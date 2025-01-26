defmodule Chat.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      ChatWeb.Telemetry,
      # ✅ Use MongoDB connection instead of Ecto.Repo
      {Mongo,
       [
         name: :mongo,
         url: System.get_env("MONGO_URL"),
         database: "rails_db",
         pool_size: 5
       ]},
      {Phoenix.PubSub, name: Chat.PubSub},
      # Start the Finch HTTP client for sending emails
      # Start the Phoenix Endpoint
      ChatWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: Chat.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    ChatWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
