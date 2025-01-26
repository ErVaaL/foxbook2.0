defmodule Chat.Message do
  @moduledoc "Defines a Message struct for MongoDB storage"

  @derive {Jason.Encoder, only: [:id, :sender_id, :receiver_id, :content, :timestamp]}
  defstruct [:id, :sender_id, :receiver_id, :content, :timestamp]

  @type t :: %__MODULE__{
          id: String.t(),
          sender_id: String.t(),
          receiver_id: String.t(),
          content: String.t(),
          timestamp: DateTime.t()
        }

  def new(attrs) do
    %__MODULE__{
      id: attrs["_id"] |> to_string_id(),
      sender_id: attrs["sender_id"] |> to_string_id(),
      receiver_id: attrs["receiver_id"] |> to_string_id(),
      content: attrs["content"],
      timestamp: Map.get(attrs, "timestamp", DateTime.utc_now())
    }
  end

  # Convert BSON.ObjectId to string
  defp to_string_id(nil), do: nil
  defp to_string_id(%BSON.ObjectId{} = id), do: BSON.ObjectId.encode!(id)
  defp to_string_id(id) when is_binary(id), do: id
end
