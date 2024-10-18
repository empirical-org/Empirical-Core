# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_stem_vaults
#
#  id          :bigint           not null, primary key
#  automl_data :jsonb            not null
#  conjunction :string           not null
#  stem        :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  activity_id :integer          not null
#  prompt_id   :integer
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_stem_vault, class: 'Evidence::Research::GenAI::StemVault' do
          stem { 'This is the stem' }
          activity { association :evidence_research_gen_ai_activity }
          conjunction { StemVault::CONJUNCTIONS.sample }
        end
      end
    end
  end
end
