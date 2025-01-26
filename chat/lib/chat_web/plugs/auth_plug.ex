defmodule ChatWeb.Plugs.AuthPlug do
  @moduledoc "Plug for authenticating users using JWT"
  import Plug.Conn
  alias Chat.Auth

  def init(opts), do: opts

  def call(conn, _opts) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
         {:ok, claims} <- Auth.verify_token(token) do
      assign(conn, :current_user, claims["sub"])
    else
      _ ->
        conn
        |> send_resp(401, Jason.encode!(%{error: "Unauthorized"}))
        |> halt()
    end
  end
end
