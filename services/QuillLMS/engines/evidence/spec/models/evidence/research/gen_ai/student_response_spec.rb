# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_student_responses
#
#  id                        :bigint           not null, primary key
#  text                      :text             not null
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  activity_prompt_config_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe StudentResponse, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:text) }
        it { should validate_presence_of(:activity_prompt_config_id)}
        it { should belong_to(:activity_prompt_config)}
        it { should have_readonly_attribute(:text) }
        it { should have_readonly_attribute(:activity_prompt_config_id) }

        it { have_one(:quill_feedback).dependent(:destroy) }
        it { have_many(:llm_feedbacks).dependent(:destroy) }

        describe 'data_partition scopes' do
          let!(:testing_feedback) { create(:evidence_research_gen_ai_quill_feedback, :testing) }
          let!(:fine_tuning_feedback) { create(:evidence_research_gen_ai_quill_feedback, :fine_tuning) }
          let!(:prompt_engineering_feedback) { create(:evidence_research_gen_ai_quill_feedback, :prompt_engineering) }

          it { expect(described_class.testing_data).to eq [testing_feedback.student_response] }
          it { expect(described_class.fine_tuning_data).to eq [fine_tuning_feedback.student_response] }
          it { expect(described_class.prompt_engineering_data).to eq [prompt_engineering_feedback.student_response] }
        end

        describe '#quill_optimal?' do
          subject { student_response.quill_optimal? }

          let(:quill_feedback) { create(:evidence_research_gen_ai_quill_feedback) }
          let(:student_response) { quill_feedback.student_response }

          before { allow(quill_feedback).to receive(:optimal?).and_return(is_optimal) }

          context 'when quill feedback is optimal' do
            let(:is_optimal) { true }

            it { is_expected.to eq true }
          end

          context 'when quill feedback is not optimal' do
            let(:is_optimal) { false }

            it { is_expected.to eq false }
          end
        end
      end
    end
  end
end
