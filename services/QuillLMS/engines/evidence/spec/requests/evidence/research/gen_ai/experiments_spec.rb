require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe 'Experiments', type: :request do
        include Evidence::Engine.routes.url_helpers

        subject { post research_gen_ai_experiments_path, params: { experiment: } }

        let(:valid_params) { { experiment: { llm_config_id: 1, llm_prompt_id: 1, passage_prompt_id: 1 } } }

        describe 'POST research_gen_ai_experiments_path' do
          before { allow(RunExperimentWorker).to receive(:perform_async) }

          context 'with valid parameters' do
            let(:experiment) { { llm_config_id: 1, llm_prompt_id: 1, passage_prompt_id: 1 } }

            it { expect { subject }.to change(Experiment, :count).by(1) }

            it 'enqueues a worker' do
              expect(RunExperimentWorker).to receive(:perform_async)
              subject
              expect(response).to have_http_status(:created)
            end
          end

          context 'with invalid parameters' do
            let(:experiment) { { llm_config_id: nil, llm_prompt_id: nil, passage_prompt_id: nil } }

            it { expect { subject }.not_to change(Experiment, :count) }

            it 'does not enqueue a worker' do
              expect(RunExperimentWorker).not_to receive(:perform_async)
              subject
              expect(response).to have_http_status(:unprocessable_entity)
            end
          end
        end
      end
    end
  end
end
