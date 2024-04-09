# frozen_string_literal: true

module Evidence
  module Gemini
    module Concerns
      module Api
        extend ActiveSupport::Concern

        class CleanedResultsError < StandardError; end
        class MaxAttemptsError < StandardError; end
        class MaxRetriesError < StandardError; end
        class RateLimitError < StandardError; end
        class ServiceUnavailableError < StandardError; end

        BASE_URI = Evidence::Gemini::BASE_URI
        BLOCK_NONE = "BLOCK_NONE"

        MAX_RETRIES = 10
        MAX_ATTEMPTS = 5
        MAX_SLEEP_FOR_BACKOFF = 60.seconds

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
          rescue CleanedResultsError, MaxRetriesError => e
            raise MaxAttemptsError, e.message if num_attempts >= MAX_ATTEMPTS

            num_attempts += 1
            puts "Retrying attempt #{num_attempts}"
            retry
          rescue *Evidence::HTTP_TIMEOUT_ERRORS
            []
          end
        end

        private def endpoint = "#{BASE_URI}/#{model_version}:#{instruction}?key=#{Evidence::Gemini::API_KEY}"

        private def body = request_body.merge(safety_settings: SAFETY_SETTINGS).to_json

        private def headers = { "Content-Type" => "application/json" }

        private def post_with_backoff(retries: 0)
          response = self.class.post(endpoint, body:, headers:, timeout: TIMEOUT)

          raise ServiceUnavailableError, "Service is unavailable" if response.code == 503
          raise RateLimitError, "Rate limit exceeded. Please try again later." if response.code == 429

          response
        rescue => e
          raise MaxRetriesError, e.message if retries >= MAX_RETRIES

          retries += 1
          sleep [2**retries, MAX_SLEEP_FOR_BACKOFF].min
          retry
        end
      end
    end
  end
end
