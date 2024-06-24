# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_test_examples
#
#  id                    :bigint           not null, primary key
#  automl_feedback       :text
#  automl_status         :string
#  highlight             :text
#  staff_assigned_status :string           not null
#  staff_feedback        :text
#  student_response      :text             not null
#  topic_tag             :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  dataset_id            :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe TestExample, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should belong_to(:dataset)}

        it { should validate_presence_of(:staff_assigned_status) }
        it { should validate_presence_of(:student_response) }
        it { should validate_presence_of(:dataset_id) }

        it { should have_readonly_attribute(:staff_assigned_status) }
        it { should have_readonly_attribute(:dataset_id) }
        it { should have_readonly_attribute(:student_response) }

        describe 'validations' do
          subject { create(factory, dataset:) }

          let(:dataset) { create(:evidence_research_gen_ai_dataset, locked:) }

          context 'locked dataset' do
            let(:locked) { true }

            it { expect { subject }.to raise_error(ActiveRecord::RecordInvalid) }
          end

          context 'unlocked dataset' do
            let(:locked) { false }

            it { expect { subject }.not_to raise_error }
          end
        end
      end
    end
  end
end
