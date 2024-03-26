# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ApplicationController < ActionController::Base
        before_action :staff!

        layout 'evidence/research/gen_ai/application'

        def staff!
          return if current_user&.staff?

          auth_failed
        end

        def sign_out
          reset_session
          remove_instance_variable :@current_user if defined?(@current_user)
        end

        def current_user
          @current_user ||= User.find_by(id: session[:user_id])
        end

        def auth_failed
          sign_out
          redirect_to '/'
        end
      end
    end
  end
end
