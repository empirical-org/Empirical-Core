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
        it { should validate_presence_of(:response) }
        it { should validate_presence_of(:passage_prompt_id)}
        it { should belong_to(:passage_prompt)}
        it { should have_readonly_attribute(:response) }
        it { should have_readonly_attribute(:passage_prompt_id) }

        it { have_one(:example_feedback).dependent(:destroy) }
        it { have_many(:llm_feedbacks).dependent(:destroy) }

        it { expect(build(:evidence_research_gen_ai_passage_prompt_response)).to be_valid }

        describe '.testing_data' do
          subject { PassagePromptResponse.testing_data }

          let!(:testing_feedback) { create(:evidence_research_gen_ai_example_feedback, :testing) }
          let!(:fine_tuning_feedback) { create(:evidence_research_gen_ai_example_feedback, :fine_tuning) }
          let!(:prompt_engineering_feedback) { create(:evidence_research_gen_ai_example_feedback, :prompt_engineering) }

          it { is_expected.to eq [testing_feedback.passage_prompt_response] }
        end

        describe '#example_optimal?' do
          subject { passage_prompt_response.example_optimal? }

          let(:example_feedback) { create(:evidence_research_gen_ai_example_feedback) }
          let(:passage_prompt_response) { example_feedback.passage_prompt_response }

          before { allow(example_feedback).to receive(:optimal?).and_return(is_optimal) }

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
