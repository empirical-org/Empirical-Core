# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_datasets
#
#  id               :bigint           not null, primary key
#  locked           :boolean          default(FALSE), not null
#  optimal_count    :integer          default(0), not null
#  suboptimal_count :integer          default(0), not null
#  version          :integer          not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  stem_vault_id    :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_dataset, class: 'Evidence::Research::GenAI::Dataset' do
          stem_vault { association :evidence_research_gen_ai_stem_vault }
        end
      end
    end
  end
end
