# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_configs
#
#  id         :bigint           not null, primary key
#  vendor     :string           not null
#  version    :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class LLMConfig < ApplicationRecord
        class UnsupportedVendorError < StandardError; end

        GOOGLE = 'google'

        GOOGLE_VERSIONS = [
          GEMINI_1_0_PRO = 'gemini-1.0-pro',
          GEMINI_1_5_PRO_LATEST = 'gemini-1.5-pro-latest',
          GEMINI_1_5_FLASH_LATEST = 'gemini-1-5-flash-latest'
        ].freeze

        GOOGLE_JSON_FORMAT_RESPONSES = { "generationConfig": { "response_mime_type": "application/json" } }.freeze

        OPEN_AI = 'open_ai'

        OPEN_AI_VERSIONS = [
          GPT_3_5_TURBO_0125 = 'gpt-3.5-turbo-0125',
          GPT_4_TURBO_2024_04_09 = 'gpt-4-turbo-2024-04-09',
          GPT_4_O = 'gpt-4o'
        ]

        OPEN_AI_JSON_FORMAT_RESPONSES = { "response_format": {"type": "json_object"} }.freeze

        VENDOR_MAP = {
          GOOGLE => Evidence::Gemini::Completion,
          OPEN_AI => Evidence::OpenAI::Completion
        }.freeze


        validates :vendor, presence: true
        validates :version, presence: true

        attr_readonly :vendor, :version

        def llm_client = VENDOR_MAP.fetch(vendor) { raise UnsupportedVendorError }

        def google? = vendor == GOOGLE
        def open_ai? = vendor == OPEN_AI

        def request_body_customizations
          return OPEN_AI_JSON_FORMAT_RESPONSES if open_ai? && version.in?([GPT_3_5_TURBO_0125, GPT_4_TURBO_2024_04_09, GPT_4_O])
          return GOOGLE_JSON_FORMAT_RESPONSES if google? && version.in?([GEMINI_1_5_PRO_LATEST, GEMINI_1_5_FLASH_LATEST])

          {}
        end

        def to_s = "#{vendor}: #{version}"
      end
    end
  end
end
