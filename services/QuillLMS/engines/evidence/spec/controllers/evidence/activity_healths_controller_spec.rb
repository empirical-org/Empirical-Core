# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(ActivityHealthsController, :type => :controller) do
    before { @routes = Engine.routes }

    context 'should index' do
      it 'should return successfully - no activity healths' do
        get(:index)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end

      context 'should return activity healths' do
        let!(:activity_health) { create(:evidence_activity_health) }

        it 'should return successfully' do
          get(:index)
          parsed_response = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
          expect(parsed_response.first["name"]).to(eq(activity_health.name))
          expect(parsed_response.first["version"]).to(eq(activity_health.version))
          expect(parsed_response.first["completion_rate"]).to(eq(activity_health.completion_rate))
        end
      end
    end
  end
end
