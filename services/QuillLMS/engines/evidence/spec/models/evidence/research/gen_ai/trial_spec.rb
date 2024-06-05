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
#  llm_id              :integer          not null
#  llm_prompt_id       :integer          not null
#  passage_prompt_id   :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Trial, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:status) }
        it { should validate_presence_of(:llm_id) }
        it { should validate_presence_of(:llm_prompt_id) }
        it { should validate_presence_of(:passage_prompt_id) }
        it { should validate_inclusion_of(:status).in_array(described_class::STATUSES) }
        it { should have_readonly_attribute(:llm_id) }
        it { should have_readonly_attribute(:llm_prompt_id) }
        it { should have_readonly_attribute(:passage_prompt_id) }

        it { belong_to(:llm) }
        it { belong_to(:llm_prompt) }
        it { belong_to(:passage_prompt) }

        it { have_many(:llm_feedbacks) }
        it { have_many(:student_responses).through(:passage_prompt) }
        it { have_many(:quill_feedbacks).through(:student_responses) }

        describe '#run' do
          subject { trial.run }

          let(:trial) { create(factory, num_examples:) }
          let(:num_examples) { 3 }
          let(:passage_prompt) { trial.passage_prompt }
          let(:llm) { trial.llm }
          let(:llm_prompt) { trial.llm_prompt }
          let(:llm_feedback_text) { { 'feedback' => 'This is feedback' }.to_json }

          let(:student_responses) do
            create_list(:evidence_research_gen_ai_student_response, num_examples, passage_prompt:)
          end

          before do
            allow(trial).to receive(:llm).and_return(llm)

            allow(llm)
              .to receive(:completion)
              .with(prompt: instance_of(String))
              .and_return(llm_feedback_text)

            allow(CalculateResultsWorker).to receive(:perform_async).with(trial.id)

            student_responses.each do |student_response|
              create(:evidence_research_gen_ai_quill_feedback, :testing, student_response:)
            end
          end

          it { expect { subject }.to change { trial.reload.status }.to(described_class::COMPLETED) }
          it { expect { subject }.to change(LLMFeedback, :count).by(num_examples) }

          context 'when creating LLM prompt responses feedbacks' do
            it 'only processes testing data responses' do
              expect(llm).to receive(:completion).exactly(num_examples).times

              subject
            end

            it 'measures and records API call times' do
              # 2 calls for each example: one for the API call and one for the trial_duration
              expect(Time.zone).to receive(:now).exactly((num_examples * 2) + 2).times.and_call_original

              subject

              expect(trial.reload.api_call_times.size).to eq(num_examples)
            end
          end

          context 'when an error occurs during execution' do
            let(:error_message) { 'Test error' }

            before do
              allow(trial)
                .to receive(:create_llm_prompt_responses_feedbacks)
                .and_raise(StandardError, error_message)
            end

            it { expect { subject }.to change { trial.reload.status }.to(described_class::FAILED) }
            it { expect { subject }.not_to change(LLMFeedback, :count) }
            it { expect { subject }.to change { trial.reload.trial_errors }.from([]).to([error_message]) }
          end

          context 'when the trial is not pending' do
            before { trial.update!(status: described_class::FAILED) }

            it { expect { subject }.not_to change { trial.reload.status } }
            it { expect { subject }.not_to change(Evidence::Research::GenAI::LLMFeedback, :count) }
          end
        end
      end
    end
  end
end
