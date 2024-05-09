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
        OPEN_AI = 'open_ai'

        VENDOR_MAP = {
          GOOGLE => Evidence::Gemini::Completion,
          OPEN_AI => Evidence::OpenAI::Completion
        }.freeze

        validates :vendor, presence: true
        validates :version, presence: true

        attr_readonly :vendor, :version

        def llm_client = VENDOR_MAP.fetch(vendor) { raise UnsupportedVendorError }

        def model_key = version.to_sym

        def to_s = "#{vendor}: #{version}"
      end
    end
  end
end
