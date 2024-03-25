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

        VENDORS = [
          GOOGLE = 'google'
        ]

        validates :vendor, presence: true
        validates :version, presence: true

        attr_readonly :vendor, :version

        def llm_client = VENDOR_MAP.fetch(vendor) { raise UnsupportedVendorError }

        def to_s = "#{vendor}: #{version}"
      end
    end
  end
end
