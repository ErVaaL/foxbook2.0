defmodule Chat.Repo do
  use GenServer

  def start_link(_) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(_) do
    {:ok, conn} = Mongo.start_link(url: "mongodb://localhost:27017/chat_db")
    {:ok, conn}
  end

  def get_connection do
    Application.get_env(:chat, :mongo) || Chat.Mongo
  end

  def handle_call(:get_conn, _from, conn) do
    {:reply, conn, conn}
  end
end
