import Config
DotenvParser.load_file(".env")

# Enable the Phoenix server if running in production (useful for releases)
if System.get_env("PHX_SERVER") do
  config :chat, ChatWeb.Endpoint, server: true
end

if config_env() == :prod do
  ## ====== DATABASE CONFIGURATION ====== ##

  # MongoDB Connection - Read from ENV, or use default local database
  mongo_url =
    System.get_env("MONGO_URL") ||
      raise """
      environment variable MONGO_URL is missing.
      Expected format: mongodb://USER:PASS@HOST:PORT/chat_db?authSource=admin
      """


  config :chat, :mongo,
    name: Chat.Mongo,
    url: mongo_url,
    pool_size: 10

  ## ====== SECRET KEYS ====== ##

  # Secret key base for encrypting cookies and sessions
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      Generate one using: mix phx.gen.secret
      """

  ## ====== APPLICATION CONFIGURATION ====== ##

  # Host & Port Configuration
  host = System.get_env("PHX_HOST") || "example.com"
  port = String.to_integer(System.get_env("PORT") || "4000")

  # DNS Clustering (optional)
  config :chat, :dns_cluster_query, System.get_env("DNS_CLUSTER_QUERY")

  # Phoenix Endpoint Configuration
  config :chat, ChatWeb.Endpoint,
  url: [host: System.get_env("PHX_HOST") || "localhost"],
  http: [port: String.to_integer(System.get_env("PORT") || "4000")],
  secret_key_base: System.get_env("SECRET_KEY_BASE")
end

