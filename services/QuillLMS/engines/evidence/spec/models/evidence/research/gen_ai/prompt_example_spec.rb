# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_examples
#
#  id                    :bigint           not null, primary key
#  staff_assigned_status :string           not null
#  staff_feedback        :text
#  student_response      :text             not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  dataset_id            :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe PromptExample, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should belong_to(:dataset)}

        it { should validate_presence_of(:staff_assigned_status) }
        it { should validate_presence_of(:student_response) }
        it { should validate_presence_of(:dataset_id) }

        it { should have_readonly_attribute(:staff_assigned_status) }
        it { should have_readonly_attribute(:dataset_id) }
        it { should have_readonly_attribute(:student_response) }

        it_behaves_like 'has_assigned_status'
      end
    end
  end
end
