require_dependency 'comprehension/application_controller'

module Comprehension
  class ApiController < ApplicationController
    skip_before_action :verify_authenticity_token
  end
end
