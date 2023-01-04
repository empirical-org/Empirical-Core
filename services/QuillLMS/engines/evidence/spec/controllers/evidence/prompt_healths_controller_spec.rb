# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(PromptHealthsController, :type => :controller) do
    before { @routes = Engine.routes }

    context 'should index' do
      it 'should return successfully - no prompt healths' do
        get(:index)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(parsed_response.class).to eq(Array)
        expect(parsed_response.empty?).to eq(true)
      end

      context 'should return activity healths' do
        let!(:activity) { create(:evidence_activity) }
        let!(:prompt) { create(:evidence_prompt, activity: activity) }
        let!(:prompt_health) { create(:evidence_prompt_health, prompt_id: prompt.id) }

        it 'should return successfully' do
          get(:index)
          parsed_response = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(parsed_response.class).to eq(Array)
          expect(parsed_response.empty?).to(eq(false))
          expect(parsed_response.first["text"]).to(eq(prompt_health.text))
          expect(parsed_response.first["current_version"]).to(eq(prompt_health.current_version))
          expect(parsed_response.first["confidence"]).to(eq(prompt_health.confidence))
        end
      end
    end
  end
end
