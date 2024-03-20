# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ApplicationController < ActionController::Base
        include QuillAuthentication

        before_action :staff!

        layout 'evidence/research/gen_ai/application'
      end
    end
  end
end
