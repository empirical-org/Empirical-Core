# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llms
#
#  id         :bigint           not null, primary key
#  order      :integer          not null
#  vendor     :string           not null
#  version    :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

module Evidence
  module Research
    module GenAI
      class LLM < ApplicationRecord
        class UnsupportedVendorError < StandardError; end

        DEFAULT_TEMPERATURE = 1.0

        GOOGLE_VERSIONS = [
          GEMINI_1_0_PRO = 'gemini-1.0-pro',
          GEMINI_1_5_PRO_LATEST = 'gemini-1.5-pro-latest',
          GEMINI_1_5_FLASH_LATEST = 'gemini-1.5-flash-latest'
        ].freeze

        GOOGLE_JSON_FORMAT_RESPONSES = { "generationConfig": { "response_mime_type": 'application/json' } }.freeze

        OPEN_AI_VERSIONS = [
          GPT_3_5_TURBO_0125 = 'gpt-3.5-turbo-0125',
          GPT_4_TURBO_2024_04_09 = 'gpt-4-turbo-2024-04-09',
          GPT_4_O = 'gpt-4o'
        ]

        OPEN_AI_JSON_FORMAT_RESPONSES = { "response_format": { "type": 'json_object' } }.freeze

        validates :vendor, presence: true
        validates :version, presence: true
        validates :order, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

        attr_readonly :vendor, :version

        before_validation :set_default_order

        def self.auto_cot = find_by(vendor: OPEN_AI, version: GPT_4_O)
        def self.g_eval = find_by(vendor: GOOGLE, version: GEMINI_1_5_FLASH_LATEST)

        def completion_client = VENDOR_COMPLETION_MAP.fetch(vendor) { raise UnsupportedVendorError }

        def completion(prompt, temperature = DEFAULT_TEMPERATURE) = completion_client.run(prompt:, llm: self, temperature:)

        def google? = vendor == GOOGLE
        def open_ai? = vendor == OPEN_AI

        def request_body_customizations
          return OPEN_AI_JSON_FORMAT_RESPONSES if open_ai? && version.in?([GPT_3_5_TURBO_0125, GPT_4_TURBO_2024_04_09, GPT_4_O])
          return GOOGLE_JSON_FORMAT_RESPONSES if google? && version.in?([GEMINI_1_5_PRO_LATEST, GEMINI_1_5_FLASH_LATEST])

          {}
        end

        def to_s = "#{vendor}: #{version}"

        private def set_default_order
          self.order ||= (self.class.maximum(:order) || 0) + 1
        end
      end
    end
  end
end
