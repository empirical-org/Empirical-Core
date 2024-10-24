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
          GEMINI_1_5_FLASH_LATEST = 'gemini-1.5-flash-latest'
        ].freeze

        OPEN_AI_VERSIONS = [
          GPT_4_O = 'gpt-4o-2024-08-06'
        ].freeze

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

        def to_s = "#{vendor}: #{version}"

        private def set_default_order
          self.order ||= (self.class.maximum(:order) || 0) + 1
        end
      end
    end
  end
end
