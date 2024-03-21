# frozen_string_literal: true

module Evidence
  module Gemini
    module Concerns
      module Api
        extend ActiveSupport::Concern

        class ServiceUnavailableError < StandardError; end

        BASE_URI = Evidence::Gemini::BASE_URI
        BLOCK_NONE = "BLOCK_NONE"

        MAX_RETRIES = 5
        MAX_ATTEMPTS = 5

        SAFETY_SETTING_CATEGORIES = %w[
          HARM_CATEGORY_HARASSMENT
          HARM_CATEGORY_HATE_SPEECH
          HARM_CATEGORY_SEXUALLY_EXPLICIT
          HARM_CATEGORY_DANGEROUS_CONTENT
        ].freeze

        SAFETY_SETTINGS = SAFETY_SETTING_CATEGORIES.map { |category| { category:, threshold: BLOCK_NONE } }.freeze
        TIMEOUT = 5.minutes.to_i

        included do
          include HTTParty
          base_uri BASE_URI

          attr_accessor :response
        end

        def run
          num_attempts = 0

          begin
            @response = post_with_backoff
            cleaned_results
          rescue FinishReasonOtherError => e
            return [] if num_attempts >= MAX_ATTEMPTS

            puts "num_attempts: #{num_attempts}"
            num_attempts += 1
            retry
          rescue *Evidence::HTTP_TIMEOUT_ERRORS
            []
          end
        end

        private def endpoint = "#{BASE_URI}?key=#{Evidence::Gemini::API_KEY}"

        private def body = request_body.merge(safety_settings:).to_json

        private def headers = { "Content-Type" => "application/json" }

        private def safety_settings = SAFETY_SETTINGS

        private def timeout = TIMEOUT

        # TODO: remove puts statements once this is stable
        private def post_with_backoff(retries: 0)
          response = self.class.post(endpoint, body:, headers:, timeout:)

          raise "ServiceUnavailable" if response.code == 503

          response
        rescue => e
          puts "Error: #{e.message}"
          raise "Max retries reached. Last error: #{e.message}" unless retries < MAX_RETRIES

          retries += 1
          puts "retries: #{retries}"
          sleep 2**retries
          retry
        end
      end
    end
  end
end
