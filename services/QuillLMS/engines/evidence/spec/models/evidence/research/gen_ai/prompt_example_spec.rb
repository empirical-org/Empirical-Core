# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_examples
#
#  id                           :bigint           not null, primary key
#  automl_label                 :text
#  automl_primary_feedback      :text
#  automl_secondary_feedback    :text
#  curriculum_assigned_status   :string           not null
#  curriculum_label             :string
#  curriculum_proposed_feedback :text
#  highlight                    :text
#  student_response             :text             not null
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  dataset_id                   :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe PromptExample, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should belong_to(:dataset)}

        it { should validate_presence_of(:curriculum_assigned_status) }
        it { should validate_presence_of(:student_response) }
        it { should validate_presence_of(:dataset_id) }

        it { should have_readonly_attribute(:curriculum_assigned_status) }
        it { should have_readonly_attribute(:dataset_id) }
        it { should have_readonly_attribute(:student_response) }

        it_behaves_like 'has_assigned_status'
      end
    end
  end
end
