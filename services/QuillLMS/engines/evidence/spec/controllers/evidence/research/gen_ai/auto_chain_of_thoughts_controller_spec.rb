require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe AutoChainOfThoughtsController, type: :controller do
        routes { Evidence::Engine.routes }

        let(:user) { double('User') }

        before do
          allow(controller).to receive(:current_user).and_return(user)
          allow(user).to receive(:staff?).and_return(true)
        end

        describe 'POST #create' do
          subject { post :create, params: }

          let(:task_introduction) { 'Test Task Introduction' }
          let(:evaluation_criteria) { 'Test Evaluation Criteria' }
          let(:metric) { 'Test Metric' }
          let(:step1) { 'Step 1' }
          let(:step2) { 'Step 2' }
          let(:step3) { 'Step 3' }
          let(:steps) { [step1, step2, step3] }
          let(:llm_response) { { 'steps' => steps }.to_json }

          let(:evaluation_steps) { steps.join("\n").strip }
          let(:llm_config) { double('LLMConfig', completion: llm_response) }

          before { allow(LLMConfig).to receive(:auto_cot).and_return(llm_config) }

          context 'valid params' do
            let(:params) { { task_introduction:, evaluation_criteria:, metric: } }

            it 'redirects to the new evaluation path with correct params' do
              subject

              expect(response).to redirect_to(
                new_research_gen_ai_g_eval_path(
                  research_gen_ai_g_eval: { metric:, task_introduction:, evaluation_criteria:, evaluation_steps: }
                )
              )
            end
          end
        end
      end
    end
  end
end
