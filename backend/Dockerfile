# Base image with Ruby
ARG RUBY_VERSION=3.3.5
FROM ruby:$RUBY_VERSION-slim AS base

# Rails app lives here
WORKDIR /rails

# Install base packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    libffi-dev \
    libjemalloc2 \
    libgmp-dev \
    zlib1g-dev && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Set environment variables
ENV RAILS_ENV="development" \
    BUNDLE_DEPLOYMENT="0" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="test"

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle config set force_ruby_platform true && \
    bundle install

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Entrypoint prepares the database
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Expose port for the server
EXPOSE 80

# Start server
CMD ["bin/rails", "server", "-b", "0.0.0.0"]

