require 'rails_helper'

describe  Teachers::UnitTemplatesController, type: :controller do
  include_context "Unit Assignments Variables"

  before do
    session[:user_id] = teacher.id
  end

  let(:parsed_body) { JSON.parse(response.body) }

  describe '#index, format: :json' do
    it 'responds with list of unit_templates' do
      get :index, format: :json
      expect(parsed_body['unit_templates'].length).to eq(4)
    end
  end

  describe '#fast_assign' do

    context 'creates a new unit' do
      it "can create new units and classroom activities" do
        data = {"id": unit_template1.id}
        current_jobs = FastAssignWorker.jobs.size
        post "fast_assign", (data)
        expect(FastAssignWorker.jobs.size).to eq(current_jobs + 1)
      end
    end

  end
end
