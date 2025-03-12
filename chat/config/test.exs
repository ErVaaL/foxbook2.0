import Config

# MongoDB Test Configuration
config :chat, Chat.Mongo,
  name: :chat_mongo_test,
  url: System.get_env("MONGO_TEST_URL") || "mongodb://localhost:27017/chat_test",
  database: "chat_test",
  pool_size: 5

# We don't run a server during test.
config :chat, ChatWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: System.get_env("SECRET_KEY_BASE") || "fallback-key-for-tests"
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
