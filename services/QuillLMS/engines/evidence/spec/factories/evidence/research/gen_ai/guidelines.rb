# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_guidelines
#
#  id            :bigint           not null, primary key
#  category      :string           not null
#  text          :text             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  stem_vault_id :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_guideline, class: 'Evidence::Research::GenAI::Guideline' do
          category { Guideline::CATEGORIES.sample }
          text { Faker::Lorem.sentence }
          stem_vault { association :evidence_research_gen_ai_stem_vault }
        end
      end
    end
  end
end
