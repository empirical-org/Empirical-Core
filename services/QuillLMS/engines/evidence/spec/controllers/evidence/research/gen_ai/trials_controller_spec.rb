# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe TrialsController, type: :controller do
        routes { Evidence::Engine.routes }

        let(:user) { double('User') }

        before do
          allow(controller).to receive(:current_user).and_return(user)
          allow(user).to receive(:staff?).and_return(is_staff)
        end

        describe 'POST #create' do
          let(:llm_id) { create(:evidence_research_gen_ai_llm).id }
          let(:llm_prompt_template_id) { create(:evidence_research_gen_ai_llm_prompt_template).id }
          let(:dataset_id) { create(:evidence_research_gen_ai_dataset).id }

          let(:g_eval_id) { create(:evidence_research_gen_ai_g_eval).id }

          let(:num_guidelines) { rand(1..3) }
          let(:guideline_ids) { create_list(:evidence_research_gen_ai_guideline, num_guidelines).map(&:id) }

          let(:num_prompt_examples) { rand(1..3) }
          let(:prompt_example_ids) { create_list(:evidence_research_gen_ai_prompt_example, num_prompt_examples).map(&:id) }

          subject do
            post :create, params: {
              dataset_id:,
              research_gen_ai_trial: {
                g_eval_id:,
                guideline_ids:,
                llm_id:,
                llm_prompt_template_id:,
                prompt_example_ids:
              }
            }
          end

          context 'as not staff' do
            let(:is_staff) { false }

            it { expect { subject }.not_to change(Trial, :count) }
            it { expect(subject).to redirect_to '/' }
          end

          context 'as staff' do
            let(:is_staff) { true }

            context 'with valid parameters' do
              before { allow(RunTrialWorker).to receive(:perform_async) }

              it 'enqueues a worker for each combination and redirects' do
                expect(RunTrialWorker).to receive(:perform_async)
                subject
                expect(response).to redirect_to(research_gen_ai_dataset_trial_path(dataset_id:, id: Trial.last.id))
              end
            end

            context 'with invalid parameters' do
              let(:llm_id) { nil }

              it { expect { subject }.not_to change(Trial, :count) }

              it 'does not enqueue a worker' do
                expect(RunTrialWorker).not_to receive(:perform_async)
                subject
              end
            end
          end
        end
      end
    end
  end
end
