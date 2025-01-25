defmodule Chat.Message do
  @moduledoc "Defines a Message struct for MongoDB storage"

  defstruct [:id, :sender, :receiver, :content, :timestamp]

  @type t :: %__MODULE__{
          id: String.t(),
          sender: String.t(),
          receiver: String.t(),
          content: String.t(),
          timestamp: DateTime.t()
        }

  def new(attrs) do
    %__MODULE__{
      id: Map.get(attrs, "_id", BSON.ObjectId.encode!(BSON.ObjectId.new())),
      sender: Map.get(attrs, "sender"),
      receiver: Map.get(attrs, "receiver"),
      content: Map.get(attrs, "content"),
      timestamp: Map.get(attrs, "timestamp", DateTime.utc_now())
    }
  end
end
