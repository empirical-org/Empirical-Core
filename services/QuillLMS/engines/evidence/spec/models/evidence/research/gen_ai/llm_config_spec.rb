# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_configs
#
#  id         :bigint           not null, primary key
#  vendor     :string
#  version    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMConfig, type: :model do
        it { should validate_presence_of(:vendor) }
        it { should validate_presence_of(:version) }

        it { expect(FactoryBot.build(:evidence_research_gen_ai_llm_config)).to be_valid }
      end
    end
  end
end
