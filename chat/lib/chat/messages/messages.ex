defmodule Chat.Messages do
  @moduledoc "Handles message storage and retrieval (MongoDB)."

  alias Chat.Message
  alias Chat.MongoDB
  require Logger

  @collection "messages"

  # ✅ Create a new message
  def create_message(attrs) do
    message = Message.new(attrs)

    case MongoDB.insert_one(@collection, Map.from_struct(message)) do
      {:ok, %{inserted_id: inserted_id}} ->
        {:ok, Map.put(message, :id, BSON.ObjectId.encode!(inserted_id))}

      {:error, reason} ->
        Logger.error("Failed to insert message: #{inspect(reason)}")
        {:error, reason}
    end
  end

  # ✅ Get all messages
  def list_messages do
    MongoDB.find_all(@collection)
    |> Enum.map(&convert_id/1)
  end

  # ✅ Get messages between two users
  def get_conversation(user1, user2) do
    MongoDB.find_by(@collection, %{
      "$or" => [
        %{"sender" => user1, "receiver" => user2},
        %{"sender" => user2, "receiver" => user1}
      ]
    })
    |> Enum.map(&convert_id/1)
  end

  # Get messages between two users

  defp convert_id(%{"_id" => bson_id} = doc) do
    doc
    |> Map.drop(["_id"])
    |> Map.put("id", BSON.ObjectId.encode!(bson_id))
  end

  defp convert_id(doc), do: doc
end
