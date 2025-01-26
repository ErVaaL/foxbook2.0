defmodule ChatWeb.Plugs.AuthPlug do
  import Plug.Conn
  alias Chat.Auth

  def init(opts), do: opts

  def call(conn, _opts) do
    case get_token(conn) do
      nil ->
        IO.puts("🚨 No Authorization token provided")
        assign(conn, :current_user, nil)

      token ->
        case Auth.verify_token(token) do
          {:ok, claims} ->
            user_id = claims["user_id"]
            assign(conn, :current_user, user_id)

          {:error, reason} ->
            IO.puts("🚨 Invalid token: #{inspect(reason)}")
            assign(conn, :current_user, nil)
        end
    end
  end

  defp get_token(conn) do
    conn
    |> get_req_header("authorization")
    |> List.first()
    |> case do
      "Bearer " <> token -> token
      _ -> nil
    end
  end
end
