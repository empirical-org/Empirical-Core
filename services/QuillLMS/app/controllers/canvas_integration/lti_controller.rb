# frozen_string_literal: true

module CanvasIntegration
  class LtiController < ApplicationController
    # launch is loaded within Canvas in an iframe muddling the CSRF token
    skip_before_action :verify_authenticity_token, only: [:launch]

    LAUNCH_TEXT = 'Log in to Quill.org with your Canvas credentials'
    SSO_BUTTON_TEXT = 'Click here if you are not redirected automatically.'

    def launch
      @link_text = LAUNCH_TEXT
      @link_url = canvas_integration_lti_sso_path(canvas_instance_url: params[:custom_canvas_api_baseurl])

      render layout: false   # canvas doesn't allow script tags in iframes
    end

    def launch_config
      @launch_url = canvas_integration_lti_launch_url
    end

    def sso
      @canvas_instance_id = CanvasInstance.find_by(url: params[:canvas_instance_url])&.id
      @button_text = SSO_BUTTON_TEXT
      @button_url = Auth::Canvas::ACCESS_PATH
    end
  end
end
