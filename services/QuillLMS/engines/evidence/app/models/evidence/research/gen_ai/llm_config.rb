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

        JSON_FORMAT_RESPONSES = { "generationConfig": { "response_mime_type": "application/json" } }.freeze

        OPEN_AI = 'open_ai'

        VENDOR_MAP = {
          GOOGLE => Evidence::Gemini::Completion,
          OPEN_AI => Evidence::OpenAI::Completion
        }.freeze

        VERSIONS_MAP = {
        }

        validates :vendor, presence: true
        validates :version, presence: true

        attr_readonly :vendor, :version

        def llm_client = VENDOR_MAP.fetch(vendor) { raise UnsupportedVendorError }

        def request_body_customizations
          return {} unless vendor == GOOGLE
          return {} unless llm_config.version.in [GEMINI_1_0_PRO, GEMINI_1_5_PRO_LATEST, GEMINI_1_5_FLASH_LATEST]

          JSON_FORMAT_RESPONSES
        end

        def to_s = "#{vendor}: #{version}"
      end
    end
  end
end
