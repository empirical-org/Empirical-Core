# Be sure to restart your server when you modify this file.


if Rails.env.production?
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_session', domain: '.quill.org'
else
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_session'
end
