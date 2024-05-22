# frozen_string_literal: true

module Evidence
  module VertexAI
    class ClientFetcher
      def self.run(client_class:, project:) = client_class.new {  |config| config.credentials = credentials(project) }

      def self.credentials(project) = JSON.parse(ENV.fetch("VERTEX_AI_CREDENTIALS_#{project.upcase}", '{}'))

      def self.project_id(project) = credentials(project)['project_id']
    end
  end
end
