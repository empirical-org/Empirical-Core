# frozen_string_literal: true

module CanvasIntegration
  class LtiController < ApplicationController
    # launch is loaded within Canvas in an iframe muddling the CSRF token
    skip_before_action :verify_authenticity_token, only: [:launch, :sso]

    layout 'canvas_integration/lti'

    LAUNCH_TEXT = 'This link will redirect you to Quill.org for SSO'
    SSO_TEXT = 'Log into Quill with your Canvas account (SSO)'

    def launch
      @link_text = LAUNCH_TEXT
      @link_url = canvas_integration_lti_sso_path(canvas_instance_url: params[:custom_canvas_api_domain])
    end

    def launch_config
      @launch_url = canvas_integration_lti_launch_url
    end

    def sso
      @canvas_instance_id = CanvasInstance.find_by(url: params[:canvas_instance_url])&.id
      @button_text = SSO_TEXT
      @button_url = Auth::Canvas::ACCESS_PATH
    end
  end
end
