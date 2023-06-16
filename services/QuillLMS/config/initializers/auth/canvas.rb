# frozen_string_literal: true

module Auth
  module Canvas
    OMNIAUTH_REQUEST_PATH = '/auth/canvas'
    OMNIAUTH_CALLBACK_PATH = '/auth/canvas/callback'

    class Setup
      attr_reader :env, :request, :session, :strategy

      OMNIAUTH_STRATEGY_ASSIGNED = 'OmniAuth strategy assigned'

      def self.call(env)
        new(env).run
      end

      def initialize(env, strategy: nil)
        @env = env
        @request = Rack::Request.new(env)
        @session = request.session
        @strategy = strategy || env['omniauth.strategy']
      end

      def run
        setup if request_phase?
        set_omniauth_strategy
        teardown if callback_phase?
        [200, {}, OMNIAUTH_STRATEGY_ASSIGNED]
      end

      private def setup
        session[:canvas_instance_id] = env['rack.request.form_hash']['canvas_instance_id'].to_i
      end

      private def callback_phase?
        request.path == OMNIAUTH_CALLBACK_PATH
      end

      private def canvas_instance
        @canvas_instance ||= CanvasInstance.find(session[:canvas_instance_id])
      end

      private def request_phase?
        request.path == OMNIAUTH_REQUEST_PATH
      end

      private def teardown
        session.delete(:canvas_instance_id)
      end

      private def set_omniauth_strategy
        return unless canvas_instance

        strategy.options[:client_options].site = canvas_instance.url
        strategy.options[:client_id] = canvas_instance.client_id
        strategy.options[:client_secret] = canvas_instance&.client_secret
      end
    end
  end
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :canvas, setup: Auth::Canvas::Setup
end
