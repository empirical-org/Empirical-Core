require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe ExperimentsController, type: :controller do
        routes { Evidence::Engine.routes }

        let(:user) { double('User') }

        before do
          allow(controller).to receive(:current_user).and_return(user)
          allow(user).to receive(:staff?).and_return(is_staff)
        end

        describe 'POST #create' do
          let(:llm_prompt_template_id) { create(:evidence_research_gen_ai_llm_prompt_template).id }
          let(:passage_prompt_id) { create(:evidence_research_gen_ai_passage_prompt).id }
          let(:llm_config_id) { create(:evidence_research_gen_ai_llm_config).id }
          let(:llm_prompt) { create(:evidence_research_gen_ai_llm_prompt) }

          subject do
            post :create,
              params: {
                research_gen_ai_experiment: {
                  llm_config_id:,
                  llm_prompt_template_id:,
                  passage_prompt_id:
                }
              }
          end

          context 'as not staff' do
            let(:is_staff) { false }

            it { expect { subject }.not_to change(Experiment, :count) }
            it { expect(subject).to redirect_to '/' }
          end

          context 'as staff' do
            let(:is_staff) { true }

            before do
              allow(LLMPromptBuilder)
                .to receive(:run)
                .with(llm_prompt_template_id:, passage_prompt_id:)
                .and_return(llm_prompt)
            end

            context 'with valid parameters' do
              before { allow(RunExperimentWorker).to receive(:perform_async) }

              it { expect { subject }.to change(Experiment, :count).by(1)}

              it 'enqueues a worker and redirects to the newly created experiment' do
                expect(RunExperimentWorker).to receive(:perform_async)
                subject
                expect(response).to redirect_to(Experiment.last)
              end
            end

            context 'with invalid parameters' do
              let(:llm_config_id) { nil }

              it { expect { subject }.not_to change(Experiment, :count) }

              it 'does not enqueue a worker and re-renders the new template' do
                expect(RunExperimentWorker).not_to receive(:perform_async)
                subject
              end
            end
          end
        end
      end
    end
  end
end
