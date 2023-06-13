# frozen_string_literal: true

module Auth
  module Canvas
    ACCESS_PATH = '/auth/canvas'
    ACCESS_CALLBACK_PATH = "#{ACCESS_PATH}/callback"

    class Setup
      attr_reader :env, :session

      def self.call(env)
        new(env).setup
      end

      def initialize(env)
        @env = env
        @session = Rack::Request.new(env).session
      end

      def setup
        add_session_canvas_instance_id if request_phase?
        set_omniauth_strategy
        delete_session_canvas_instance_id if callback_phase?
      end

      private def add_session_canvas_instance_id
        session[:canvas_instance_id] = env['rack.request.form_hash']['canvas_instance_id']
      end

      private def callback_phase?
        env['REQUEST_PATH'] == ACCESS_CALLBACK_PATH
      end

      private def canvas_instance
        @canvas_instance ||= CanvasInstance.find(session[:canvas_instance_id])
      end

      private def delete_session_canvas_instance_id
        session.delete(:canvas_instance_id)
      end

      private def request_phase?
        env['REQUEST_PATH'] == ACCESS_PATH
      end

      private def set_omniauth_strategy
        env['omniauth.strategy'].options[:client_options].site = canvas_instance.url
        env['omniauth.strategy'].options[:client_id] = canvas_instance.client_id
        env['omniauth.strategy'].options[:client_secret] = canvas_instance&.client_secret
      end
    end
  end
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :canvas, setup: Auth::Canvas::Setup
end
