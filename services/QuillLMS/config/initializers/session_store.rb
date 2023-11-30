# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

module SessionStore
  DEFAULT_OPTIONS = {
    httponly: true,
    same_site: :lax, # Rails default since 6.1, making it explicit
    expire_after: 60.days,
    secure: Rails.env.production? || Rails.env.staging?
  }
end

if Rails.env.production?
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_session', domain: '.quill.org', **SessionStore::DEFAULT_OPTIONS
elsif Rails.env.staging?
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_staging_session', domain: ['staging.quill.org'], **SessionStore::DEFAULT_OPTIONS
elsif Rails.env.cypress?
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_session', domain: :all, **SessionStore::DEFAULT_OPTIONS
else
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_development_session', domain: :all, **SessionStore::DEFAULT_OPTIONS
end
