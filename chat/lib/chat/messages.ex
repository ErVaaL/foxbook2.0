defmodule Chat.Messages do
  @moduledoc "Handles message storage and retrieval (MongoDB)."

  alias Chat.Message
  alias Chat.MongoDB
  require Logger

  @collection "messages"

  # ✅ Create a new message
  def create_message(attrs) do
    message = %Message{
      id: BSON.ObjectId.encode!(BSON.ObjectId.new()),
      sender: Map.get(attrs, "sender"),
      receiver: Map.get(attrs, "receiver"),
      content: Map.get(attrs, "content"),
      timestamp: DateTime.utc_now()
    }

    case MongoDB.insert_one(@collection, Map.from_struct(message)) do
      {:ok, _result} ->
        {:ok, message}

      {:error, reason} ->
        Logger.error("Failed to insert message: #{inspect(reason)}")
        {:error, reason}
    end
  end

  # ✅ Get all messages
  def list_messages do
    MongoDB.find_all(@collection)
  end

  # ✅ Get messages by sender
  def get_messages_by_sender(sender) do
    MongoDB.find_by(@collection, %{"sender" => sender})
  end
end
