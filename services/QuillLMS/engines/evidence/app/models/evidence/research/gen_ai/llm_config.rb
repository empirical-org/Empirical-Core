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
        VENDORS = [
          GOOGLE = 'google'
        ]

        validates :vendor, presence: true
        validates :version, presence: true

        def llm_client
          case vendor
          when GOOGLE then Evidence::Gemini::Completion
          else raise UnsupportedVendorError
          end
        end
      end
    end
  end
end
