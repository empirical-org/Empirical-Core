# frozen_string_literal: true

module CanvasIntegration
  class LtiController < ApplicationController
    # launch is loaded within Canvas in an iframe muddling the CSRF token
    skip_before_action :verify_authenticity_token, only: :launch

    SSO_LINK_TEXT = 'Log in to Quill.org with your Canvas credentials'

    def launch
      @link_text = SSO_LINK_TEXT
      @link_url = root_path # root_path will be replaced with SSO path in next PR

      render layout: false  # Canvas will not allow javascript in the iframe
    end

    def launch_config
      @launch_url = canvas_integration_lti_launch_url
    end
  end
end
