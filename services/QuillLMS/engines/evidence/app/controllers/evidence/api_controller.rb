# frozen_string_literal: true

require_dependency 'evidence/application_controller'

module Evidence
  class ApiController < ApplicationController
    if Object.const_defined?('NewRelicAttributable')
      include NewRelicAttributable
    end

    skip_before_action :verify_authenticity_token
  end
end
