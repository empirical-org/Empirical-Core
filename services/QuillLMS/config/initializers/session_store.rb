# Be sure to restart your server when you modify this file.
Rails.application.config.action_dispatch.cookies_serializer = :hybrid

if Rails.env.production?
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_session', domain: '.quill.org'
elsif Rails.env.staging?
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_staging_session', domain: ['staging.quill.org', 'sprint.quill.org']
elsif Rails.env.cypress?
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_session', domain: :all
else
  EmpiricalGrammar::Application.config.session_store :cookie_store, key: '_quill_development_session', domain: :all
end
