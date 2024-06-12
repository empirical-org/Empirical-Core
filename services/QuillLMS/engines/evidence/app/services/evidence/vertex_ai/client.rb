# frozen_string_literal: true

module Evidence
  module VertexAI
    class Client
      attr_reader :project

      class NotImplementedError < StandardError; end

      def self.credentials(project) = const_get("Evidence::VertexAI::VERTEX_AI_CREDENTIALS_#{project.upcase}")

      def self.project_id(project) = credentials(project)['project_id']

      def initialize(project:)
        raise NotImplementedError, "#{self.class} cannot be instantiated directly" if instance_of?(Client)

        @project = project
      end

      private def service_client
        self.class::SERVICE_CLIENT_CLASS.new do |config|
          config.credentials = self.class.credentials(project)

          yield config if block_given?
        end
      end

      private def parent = "projects/#{project_id}/locations/#{VERTEX_AI_LOCATION}"

      private def project_id = self.class.project_id(project)
    end
  end
end
