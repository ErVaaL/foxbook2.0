defmodule Chat.Message do
  @moduledoc "Defines a Message struct for MongoDB storage"

  @derive {Jason.Encoder, only: [:sender, :receiver, :content, :timestamp]}
  defstruct [:sender, :receiver, :content, :timestamp]

  @type t :: %__MODULE__{
          sender: String.t(),
          receiver: String.t(),
          content: String.t(),
          timestamp: DateTime.t()
        }

  def new(attrs) do
    %__MODULE__{
      sender: Map.get(attrs, "sender"),
      receiver: Map.get(attrs, "receiver"),
      content: Map.get(attrs, "content"),
      timestamp: Map.get(attrs, "timestamp", DateTime.utc_now())
    }
  end
end
