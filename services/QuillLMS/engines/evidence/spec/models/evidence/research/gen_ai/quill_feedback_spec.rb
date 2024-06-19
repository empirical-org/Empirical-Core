# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_quill_feedbacks
#
#  id                  :bigint           not null, primary key
#  data_partition      :string
#  label               :string           not null
#  paraphrase          :text
#  text                :text             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  student_response_id :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe QuillFeedback, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid}

        it { should validate_presence_of(:text) }
        it { should validate_presence_of(:label) }
        it { should validate_presence_of(:student_response_id)}
        it { should validate_inclusion_of(:data_partition).in_array(described_class::DATA_PARTITIONS) }

        it { should have_readonly_attribute(:text) }
        it { should have_readonly_attribute(:label) }
        it { should have_readonly_attribute(:student_response_id) }

        it { should belong_to(:student_response) }

        context 'data_partition scopes' do
          let!(:testing_feedback) { create(factory, :testing) }
          let!(:fine_tuning_feedback) { create(factory, :fine_tuning) }
          let!(:prompt_engineering_feedback) { create(factory, :prompt_engineering) }

          it { expect(described_class.testing_data).to eq [testing_feedback] }
          it { expect(described_class.fine_tuning_data).to eq [fine_tuning_feedback] }
          it { expect(described_class.prompt_engineering_data).to eq [prompt_engineering_feedback] }
        end

        it_behaves_like 'a class with optimal and suboptimal'
      end
    end
  end
end
