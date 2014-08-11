# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
EmpiricalGrammar::Application.config.secret_key_base = ENV['APP_SECRET'] || 'a553c33053a26a51ce3a5a25ea813ce5fdf1046593285272ebc2497b0cc0d98d7d787f00c2fa06a476393fffac0a4ce93edff54eca83fbb65bef335a8ad45f1b'
