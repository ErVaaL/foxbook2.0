defmodule Chat.MongoDB do
  @moduledoc "MongoDB helper module for inserting and querying data."

  alias Chat.Message

  @collection "messages"

  def insert_one(collection, document) do
    case Mongo.insert_one(:mongo, collection, document) do
      {:ok, result} -> {:ok, result}
      {:error, reason} -> {:error, reason}
    end
  end

  def find_all(collection) do
    Mongo.find(:mongo, collection, %{})
    |> Enum.map(&convert_document/1)
  end

  def find_by(collection, filter) do
    Mongo.find(:mongo, collection, filter)
    |> Enum.map(&convert_document/1)
  end

  def update_one(collection, filter, update) do
    case Mongo.find_one_and_update(:mongo, collection, filter, update, return_document: :after) do
      {:ok, %Mongo.FindAndModifyResult{value: nil}} ->
        {:error, "Message not found"}

      {:ok, %Mongo.FindAndModifyResult{value: updated_doc}} ->
        {:ok, convert_document(updated_doc)}

      {:error, reason} ->
        {:error, reason}
    end
  end

  def delete_one(collection, filter) do
    case Mongo.find_one_and_delete(:mongo, collection, filter) do
      # This means no document was found to delete
      {:ok, nil} ->
        {:error, "Message not found"}

      {:ok, deleted_doc} when is_map(deleted_doc) ->
        {:ok, convert_document(deleted_doc)}

      {:error, reason} ->
        {:error, reason}

      unexpected ->
        {:error, "Unexpected delete response: #{inspect(unexpected)}"}
    end
  end

  def get_conversation(collection, user1, user2) do
    query = %{
      "$or" => [
        %{
          "receiver_id" => BSON.ObjectId.decode!(user1),
          "sender_id" => BSON.ObjectId.decode!(user2)
        },
        %{
          "receiver_id" => BSON.ObjectId.decode!(user2),
          "sender_id" => BSON.ObjectId.decode!(user1)
        }
      ]
    }

    # ✅ Retrieve and convert documents properly
    Mongo.find(:mongo, collection, query)
    |> Enum.map(&convert_document/1)
  end

  defp convert_document(doc) do
    doc
    |> Map.put("id", BSON.ObjectId.encode!(doc["_id"]))
    # Convert sender_id
    |> Map.update("sender_id", nil, &convert_bson_id/1)
    # Convert receiver_id
    |> Map.update("receiver_id", nil, &convert_bson_id/1)
    |> Map.delete("_id")
  end

  defp convert_bson_id(nil), do: nil
  defp convert_bson_id(%BSON.ObjectId{} = id), do: BSON.ObjectId.encode!(id)
  defp convert_bson_id(id) when is_binary(id), do: id
end
