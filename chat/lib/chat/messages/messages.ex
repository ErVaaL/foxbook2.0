defmodule Chat.Messages do
  @moduledoc "Handles message storage and retrieval (MongoDB)."

  alias Chat.Message
  alias Chat.MongoDB
  require Logger

  @collection "messages"

  # ✅ Create a new message
  def create_message(attrs) do
    message = %{
      "content" => attrs["content"],
      "sender_id" => BSON.ObjectId.decode!(attrs["sender_id"]),
      "receiver_id" => BSON.ObjectId.decode!(attrs["receiver_id"]),
      "timestamp" => DateTime.utc_now()
    }

    case MongoDB.insert_one("messages", message) do
      {:ok, %{inserted_id: inserted_id}} ->
        inserted_message = Map.put(message, "_id", inserted_id)
        # ✅ Apply conversion properly
        converted = convert_id(inserted_message)
        {:ok, converted}

      {:error, reason} ->
        Logger.error("Failed to insert message: #{inspect(reason)}")
        {:error, reason}
    end
  end

  # Update message by id
  def update_message(message_id, new_content) do
    message_object_id = BSON.ObjectId.decode!(message_id)

    update_query = %{"$set" => %{"content" => new_content, "timestamp" => DateTime.utc_now()}}

    result = MongoDB.update_one(@collection, %{"_id" => message_object_id}, update_query)

    Logger.debug("🛠️ MongoDB update result: #{inspect(result)}")

    case result do
      # ✅ Handle updated document correctly
      {:ok, %{"id" => _} = updated_doc} ->
        Logger.debug("✅ Message updated successfully!")
        {:ok, updated_doc}

      # ✅ Handle case where no document was found
      {:ok, %{"matched_count" => 0}} ->
        Logger.error("⚠️ Message not found: #{message_id}")
        {:error, "Message not found"}

      # ✅ Handle MongoDB errors
      {:error, reason} ->
        Logger.error("❌ Update failed: #{inspect(reason)}")
        {:error, "Failed to update message"}

      _ ->
        Logger.error("❌ Unexpected result from MongoDB update: #{inspect(result)}")
        {:error, "Unexpected update failure"}
    end
  end

  # ✅ Delete message by id
  def delete_message(message_id) do
    message_object_id = BSON.ObjectId.decode!(message_id)

    case MongoDB.delete_one(@collection, %{"_id" => message_object_id}) do
      # ✅ Properly handle when no document is found
      {:ok, nil} ->
        Logger.error("⚠️ Message not found: #{message_id}")
        {:error, "Message not found"}

      # ✅ Handle when MongoDB returns a deleted document
      {:ok, deleted_doc} when is_map(deleted_doc) and map_size(deleted_doc) > 0 ->
        Logger.debug("✅ Deleted Message: #{inspect(deleted_doc)}")
        {:ok, "Message deleted successfully"}

      # ✅ Handle standard MongoDB error responses
      {:error, reason} ->
        Logger.error("❌ Delete failed: #{inspect(reason)}")
        {:error, "Failed to delete message"}

      # ✅ Catch any unexpected responses
      unexpected_response ->
        Logger.error("❌ Unexpected MongoDB delete response: #{inspect(unexpected_response)}")
        {:error, "Unexpected delete failure"}
    end
  end

  def get_message(message_id) do
    message_object_id = BSON.ObjectId.decode!(message_id)

    case MongoDB.find_one(@collection, %{"_id" => message_object_id}) do
      nil -> {:error, "Message not found"}
      message -> {:ok, Chat.Message.new(message)}
    end
  end

  # ✅ Get all messages
  def list_messages do
    MongoDB.find_all(@collection)
    |> Enum.map(&convert_id/1)
  end

  # ✅ Get messages between two users
  def get_conversation(user1, user2) do
    messages = MongoDB.get_conversation(@collection, user1, user2)

    if Enum.empty?(messages) do
      Logger.error("⚠️ No messages found between users #{user1} and #{user2}")
    end

    messages
  end

  defp convert_id(%{"_id" => bson_id} = doc) do
    doc
    # Convert `_id` to `id`
    |> Map.put("id", BSON.ObjectId.encode!(bson_id))
    # Convert sender_id
    |> Map.update("sender_id", nil, &convert_bson_id/1)
    # Convert receiver_id
    |> Map.update("receiver_id", nil, &convert_bson_id/1)
    # Ensure `_id` is removed
    |> Map.drop(["_id"])
  end

  # Ensure BSON.ObjectId is always converted
  defp convert_bson_id(nil), do: nil
  defp convert_bson_id(%BSON.ObjectId{} = id), do: BSON.ObjectId.encode!(id)
  defp convert_bson_id(id) when is_binary(id), do: id

  defp convert_id(doc), do: doc
end
