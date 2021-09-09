require_dependency 'evidence/application_controller'

module Evidence
  class ApiController < ApplicationController
    skip_before_action :verify_authenticity_token
  end
end
