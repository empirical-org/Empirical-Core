# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ClientFetcher < ApplicationService
        class UnsupportedVendorError < StandardError; end

        GOOGLE = 'google'

        attr_reader :llm_config

        def initialize(llm_config:)
          @llm_config = llm_config
        end

        def run
          client
        end


      end
    end
  end
end
