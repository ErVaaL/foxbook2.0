defmodule Chat.MongoDB do
  @moduledoc "MongoDB helper module for inserting and querying data."

  alias Chat.Message

  @collection "messages"

  def insert_one(collection, document) do
    case Mongo.insert_one(:chat_mongo, collection, document) do
      {:ok, result} -> {:ok, result}
      {:error, reason} -> {:error, reason}
    end
  end

  def find_all(collection) do
    Mongo.find(:chat_mongo, collection, %{})
    |> Enum.map(&convert_document/1)
  end

  def find_by(collection, filter) do
    Mongo.find(:chat_mongo, collection, filter)
    |> Enum.map(&convert_document/1)
  end

  defp convert_document(doc) do
    doc
    |> Map.put("id", BSON.ObjectId.encode!(doc["_id"]))
    |> Map.delete("_id")
  end
end
