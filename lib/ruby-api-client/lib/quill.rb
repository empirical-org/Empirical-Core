require 'oauth2'

module Quill
  autoload :ActivityModel,       'quill/activity_model'
  autoload :ActivitySession,     'quill/activity_session'
  autoload :BaseModel,           'quill/base_model'
  autoload :Client,              'quill/client'
  autoload :Configuration,       'quill/configuration'
  autoload :Endpoint,            'quill/endpoints'
  autoload :EndpointDefinitions, 'quill/endpoint_definitions'
  autoload :Oauth,               'quill/oauth'

  Configuration.namespace :quill
  Configuration.keys :api_url, :client_id, :client_secret, :access_token, :site_url
  Configuration.env ENV
end
