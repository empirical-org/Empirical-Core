# frozen_string_literal: true

module CanvasIntegration
  class LtiController < ApplicationController
    # launch is loaded within Canvas in an iframe muddling the CSRF token
    skip_before_action :verify_authenticity_token, only: [:launch]

    LAUNCH_TEXT = 'Log in to Quill.org with your Canvas credentials'
    SSO_BUTTON_TEXT = 'Click here if you are not redirected automatically.'

    def launch
      import_user
      @link_text = LAUNCH_TEXT
      @link_url = canvas_integration_lti_sso_path(canvas_instance_url: params[:custom_canvas_instance_url])

      render layout: false   # canvas doesn't allow script tags in iframes
    end

    def launch_config
      @launch_url = canvas_integration_lti_launch_url
    end

    def sso
      @canvas_instance_id = CanvasInstance.find_by(url: params[:canvas_instance_url])&.id
      @button_text = SSO_BUTTON_TEXT
      @button_params = { canvas_instance_id: @canvas_instance_id }
      @button_url = Auth::Canvas::OMNIAUTH_REQUEST_PATH
    end

    private def import_user
      CanvasIntegration::UserImporter.run(**import_user_params)
    end

    private def import_user_params
      {
        email:  params[:custom_canvas_user_email],
        external_id: params[:custom_canvas_user_external_id],
        name: params[:custom_canvas_user_name],
        role: role,
        url: params[:custom_canvas_instance_url]
      }
    end

    private def role
      RoleExtractor.run(params[:ext_roles])
    end
  end
end
