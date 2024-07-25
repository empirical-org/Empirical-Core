# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe GEvalsController, type: :controller do
        routes { Evidence::Engine.routes }

        let(:user) { double('User') }

        let(:valid_params) do
          {
            research_gen_ai_g_eval: {
              task_introduction: 'Introduction',
              evaluation_criteria: 'Criteria',
              evaluation_steps: 'Steps',
              metric: 'Metric',
              max_score: 10
            }
          }
        end

        let(:invalid_params) do
          {
            research_gen_ai_g_eval: {
              task_introduction: '',
              evaluation_criteria: '',
              evaluation_steps: '',
              metric: '',
              max_score: nil
            }
          }
        end

        before do
          allow(controller).to receive(:current_user).and_return(user)
          allow(user).to receive(:staff?).and_return(true)
        end

        describe 'POST #create' do
          subject { post :create, params: }

          context 'with valid params' do
            let(:params) { valid_params }

            it { expect { subject }.to change(GEval, :count).by(1) }

            it 'redirects to the created g_eval' do
              subject
              expect(response).to redirect_to(GEval.last)
            end
          end

          context 'with invalid params' do
            let(:params) { invalid_params }

            it { expect { subject }.not_to change(GEval, :count) }
          end
        end
      end
    end
  end
end
