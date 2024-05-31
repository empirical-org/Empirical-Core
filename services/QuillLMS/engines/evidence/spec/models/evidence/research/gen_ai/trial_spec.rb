# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  num_examples        :integer          default(0), not null
#  results             :jsonb
#  status              :string           default("pending"), not null
#  trial_duration      :float
#  trial_errors        :text             default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  llm_config_id       :integer          not null
#  llm_prompt_id       :integer          not null
#  passage_prompt_id   :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Experiment, type: :model do
        it { should validate_presence_of(:status) }
        it { should validate_presence_of(:llm_config_id) }
        it { should validate_presence_of(:llm_prompt_id) }
        it { should validate_presence_of(:passage_prompt_id) }
        it { should validate_inclusion_of(:status).in_array(described_class::STATUSES) }
        it { should have_readonly_attribute(:llm_config_id) }
        it { should have_readonly_attribute(:llm_prompt_id) }
        it { should have_readonly_attribute(:passage_prompt_id) }

        it { belong_to(:llm_config) }
        it { belong_to(:llm_prompt) }
        it { belong_to(:passage_prompt) }

        it { have_many(:llm_feedbacks) }
        it { have_many(:passage_prompt_responses).through(:passage_prompt) }
        it { have_many(:example_feedbacks).through(:passage_prompt_responses) }

        it { expect(build(:evidence_research_gen_ai_experiment)).to be_valid }

        describe '#run' do
          subject { experiment.run }

          let(:experiment) { create(:evidence_research_gen_ai_experiment, num_examples:) }
          let(:num_examples) { 3 }
          let(:passage_prompt) { experiment.passage_prompt }
          let(:llm_config) { experiment.llm_config }
          let(:llm_prompt) { experiment.llm_prompt }
          let(:llm_feedback_text) { { 'feedback' => 'This is feedback' }.to_json }

          let(:passage_prompt_responses) do
            create_list(:evidence_research_gen_ai_passage_prompt_response, num_examples, passage_prompt:)
          end

          before do
            allow(experiment).to receive(:llm_config).and_return(llm_config)

            allow(llm_config)
              .to receive(:completion)
              .with(prompt: instance_of(String))
              .and_return(llm_feedback_text)

            allow(CalculateResultsWorker).to receive(:perform_async).with(experiment.id)

            passage_prompt_responses.each do |passage_prompt_response|
              create(:evidence_research_gen_ai_example_feedback, :testing, passage_prompt_response:)
            end
          end

          it { expect { subject }.to change { experiment.reload.status }.to(described_class::COMPLETED) }
          it { expect { subject }.to change(LLMFeedback, :count).by(num_examples) }

          context 'when creating LLM prompt responses feedbacks' do
            it 'only processes testing data responses' do
              expect(llm_config).to receive(:completion).exactly(num_examples).times

              subject
            end

            it 'measures and records API call times' do
              # 2 calls for each example: one for the API call and one for the experiment_duration
              expect(Time.zone).to receive(:now).exactly((num_examples * 2) + 2).times.and_call_original

              subject

              expect(experiment.reload.api_call_times.size).to eq(num_examples)
            end
          end

          context 'when an error occurs during execution' do
            let(:error_message) { 'Test error' }

            before do
              allow(experiment)
                .to receive(:create_llm_prompt_responses_feedbacks)
                .and_raise(StandardError, error_message)
            end

            it { expect { subject }.to change { experiment.reload.status }.to(described_class::FAILED) }
            it { expect { subject }.not_to change(LLMFeedback, :count) }
            it { expect { subject }.to change { experiment.reload.experiment_errors }.from([]).to([error_message]) }
          end

          context 'when the experiment is not pending' do
            before { experiment.update!(status: described_class::FAILED) }

            it { expect { subject }.not_to change { experiment.reload.status } }
            it { expect { subject }.not_to change(Evidence::Research::GenAI::LLMFeedback, :count) }
          end
        end
      end
    end
  end
end
