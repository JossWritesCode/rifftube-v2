# TODO: Add production URLs to the list
# Use '*' if you want expose the API to the world
accept = [
  'http://127.0.0.1:5173', # Dev Frontend
  'http://localhost:5173', # Dev Frontend
  'http://127.0.0.1:5174', # Dev Frontend
  'http://localhost:5174', # Dev Frontend
]

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins accept
    resource '*',
      headers: :any,
      methods: %i[get post put delete options patch],
      expose: %w[Authorization]
  end
end
