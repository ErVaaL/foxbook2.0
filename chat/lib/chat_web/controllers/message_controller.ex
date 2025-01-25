defmodule ChatWeb.MessageController do
  use ChatWeb, :controller

  alias Chat.Messages

  # ✅ POST /messages - Create a new message
  def create(conn, params) do
    case Messages.create_message(params) do
      {:ok, message} ->
        conn
        |> put_status(:created)
        |> json(%{message: message})

      {:error, reason} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: reason})
    end
  end

  # ✅ GET /messages - List all messages
  def index(conn, _params) do
    messages = Messages.list_messages()
    json(conn, %{messages: messages})
  end

  # ✅ GET /messages/sender/:sender_id - Get messages by sender
  def get_by_sender(conn, %{"sender_id" => sender_id}) do
    messages = Messages.get_messages_by_sender(sender_id)
    json(conn, %{messages: messages})
  end
end
