defmodule Chat.Auth do
  @moduledoc "Handles JWT authentication"

  use Joken.Config

  def verify_token(token) do
    jwt_secret =
      System.get_env("JWT_SECRET") ||
        raise "JWT_SECRET is missing"

    signer = Joken.Signer.create("HS256", jwt_secret)

    case Joken.Signer.verify(token, signer) do
      {:ok, claims} -> {:ok, claims}
      {:error, reason} -> {:error, reason}
    end
  end
end
