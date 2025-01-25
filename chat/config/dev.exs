import Config

# Phoenix Endpoint Configuration
config :chat, ChatWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: System.get_env("SECRET_KEY_BASE"),
  watchers: []

# Enable dev routes for dashboard and mailbox
config :chat, dev_routes: true

# Logger Configuration
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development (avoid in production)
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime

# Disable Swoosh API client (only needed in production)
