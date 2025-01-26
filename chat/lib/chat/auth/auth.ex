defmodule Chat.Auth do
  @moduledoc "Handles JWT authentication"

  use Joken.Config

  @jwt_secret System.get_env("JWT_SECRET")

  def verify_token(token) do
    signer = Joken.Signer.create("HS256", @jwt_secret)

    Joken.token(token)
    |> Joken.verify(signer)
  end
end
