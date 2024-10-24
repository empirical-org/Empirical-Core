# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_guidelines
#
#  id                         :bigint           not null, primary key
#  curriculum_assigned_status :string           not null
#  notes                      :text
#  text                       :text             not null
#  visible                    :boolean          default(TRUE), not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  dataset_id                 :integer
#
# Indexes
#
#  index_evidence_research_gen_ai_guidelines_on_dataset_id  (dataset_id)
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_guideline, class: 'Evidence::Research::GenAI::Guideline' do
          curriculum_assigned_status { HasAssignedStatus::ASSIGNED_STATUSES.sample }
          text { Faker::Lorem.sentence }
          dataset { association :evidence_research_gen_ai_dataset }

          trait(:optimal) { curriculum_assigned_status { HasAssignedStatus::OPTIMAL } }
          trait(:suboptimal) { curriculum_assigned_status { HasAssignedStatus::SUBOPTIMAL } }
        end
      end
    end
  end
end
