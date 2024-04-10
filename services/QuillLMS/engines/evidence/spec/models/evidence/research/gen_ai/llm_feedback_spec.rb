# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_feedbacks
#
#  id                         :bigint           not null, primary key
#  label                      :string
#  text                       :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  experiment_id              :integer          not null
#  passage_prompt_response_id :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMFeedback, type: :model do
        it { should validate_presence_of(:text) }
        it { should validate_presence_of(:passage_prompt_response_id)}
        it { should validate_presence_of(:experiment_id)}

        it { should have_readonly_attribute(:text) }
        it { should have_readonly_attribute(:label) }
        it { should have_readonly_attribute(:passage_prompt_response_id) }
        it { should have_readonly_attribute(:experiment_id)}

        it { should belong_to(:passage_prompt_response) }
        it { should belong_to(:experiment) }

        it { expect(build(:evidence_research_gen_ai_llm_feedback)).to be_valid }

        it_behaves_like 'a class with optimal and sub-optimal'

        describe '#optimal_or_sub_optimal_match?' do
          subject { llm_feedback.optimal_or_sub_optimal_match? }

          let(:llm_feedback) { create(:evidence_research_gen_ai_llm_feedback) }
          let(:passage_prompt_response) { llm_feedback.passage_prompt_response }
          let(:example_feedback) { create(:evidence_research_gen_ai_example_feedback, passage_prompt_response:) }

          before do
            allow(passage_prompt_response).to receive(:example_optimal?).and_return(example_optimal)
            allow(llm_feedback).to receive(:optimal?).and_return(llm_optimal)
          end

          context 'when the example feedback is optimal' do
            let(:example_optimal) { true }

            context 'when the llm feedback is optimal' do
              let(:llm_optimal) { true }

              it { is_expected.to be true }
            end

            context 'when the llm feedback is sub-optimal' do
              let(:llm_optimal) { false }

              it { is_expected.to be false }
            end
          end

          context 'when the example feedback is sub-optimal' do
            let(:example_optimal) { false }

            context 'when the llm feedback is optimal' do
              let(:llm_optimal) { true }

              it { is_expected.to be false }
            end

            context 'when the llm feedback is sub-optimal' do
              let(:llm_optimal) { false }

              it { is_expected.to be true }
            end
          end
        end

        describe '#identical_feedback?' do
          subject { llm_feedback.identical_feedback? }

          let(:llm_feedback) { create(:evidence_research_gen_ai_llm_feedback) }
          let(:passage_prompt_response) { llm_feedback.passage_prompt_response }

          before { create(:evidence_research_gen_ai_example_feedback, passage_prompt_response:, text:) }

          context 'when the feedback is identical to the example feedback' do
            let(:text) { llm_feedback.text }

            it { expect(subject).to be true }
          end

          context 'when the feedback is not identical to the example feedback' do
            let(:text) { 'different feedback' }

            it { is_expected.to be false }
          end

          context 'when feedback is identical once stripped of leading/trailing whitespace' do
            let(:text) { "  #{llm_feedback.text}  " }

            it { is_expected.to be true }
          end
        end
      end
    end
  end
end
