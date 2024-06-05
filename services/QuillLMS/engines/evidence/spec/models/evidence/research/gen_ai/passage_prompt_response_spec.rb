# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompt_responses
#
#  id                :bigint           not null, primary key
#  response          :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  passage_prompt_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe PassagePromptResponse, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:response) }
        it { should validate_presence_of(:passage_prompt_id)}
        it { should belong_to(:passage_prompt)}
        it { should have_readonly_attribute(:response) }
        it { should have_readonly_attribute(:passage_prompt_id) }

        it { have_one(:quill_feedback).dependent(:destroy) }
        it { have_many(:llm_feedbacks).dependent(:destroy) }

        describe 'data_partition scopes' do
          let!(:testing_feedback) { create(:evidence_research_gen_ai_quill_feedback, :testing) }
          let!(:fine_tuning_feedback) { create(:evidence_research_gen_ai_quill_feedback, :fine_tuning) }
          let!(:prompt_engineering_feedback) { create(:evidence_research_gen_ai_quill_feedback, :prompt_engineering) }

          it { expect(described_class.testing_data).to eq [testing_feedback.passage_prompt_response] }
          it { expect(described_class.fine_tuning_data).to eq [fine_tuning_feedback.passage_prompt_response] }
          it { expect(described_class.prompt_engineering_data).to eq [prompt_engineering_feedback.passage_prompt_response] }
        end

        describe '#example_optimal?' do
          subject { passage_prompt_response.example_optimal? }

          let(:quill_feedback) { create(:evidence_research_gen_ai_quill_feedback) }
          let(:passage_prompt_response) { quill_feedback.passage_prompt_response }

          before { allow(quill_feedback).to receive(:optimal?).and_return(is_optimal) }

          context 'when example feedback is optimal' do
            let(:is_optimal) { true }

            it { is_expected.to eq true }
          end

          context 'when example feedback is not optimal' do
            let(:is_optimal) { false }

            it { is_expected.to eq false }
          end
        end
      end
    end
  end
end
