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

  # ✅ PATCH /messages/:id - Update message by id
  def update(conn, %{"messageId" => message_id, "content" => new_content}) do
    case Messages.update_message(message_id, new_content) do
      {:ok, updated_message} ->
        json(conn, updated_message)

      {:error, reason} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: reason})
    end
  end

  # ✅ DELETE: Remove message
  def delete(conn, %{"messageId" => message_id}) do
    case Messages.delete_message(message_id) do
      {:ok, message} ->
        json(conn, %{message: message})

      {:error, reason} ->
        conn
        |> put_status(:not_found)
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
    current_user_id = conn.assigns[:current_user]

    IO.inspect(current_user_id, label: "🔍 current_user_id")
    IO.inspect(sender_id, label: "🔍 sender_id")

    messages = Messages.get_conversation(current_user_id, sender_id)
    json(conn, %{messages: messages})
  end
end
