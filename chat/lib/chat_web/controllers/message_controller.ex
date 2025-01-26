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

  # ✅ GET /messages/conversation/:user2 - Get messages between two users
  def get_conversation(conn, %{"sender_id" => sender_id}) do
    current_user = conn.assigns[:current_user]
    messages = Messages.get_conversation(current_user, sender_id)
    json(conn, %{messages: messages})
  end
end
