require 'rails_helper'

describe GradesController do
  let(:teacher) { create(:teacher) }

  before { session[:user_id] = teacher.id }

  it { should use_before_action :authorize! }

  describe '#index' do
    it 'should render the correct json' do
      get :index
      expect(JSON.parse(response.body)).to eq({"grades" => Classroom::GRADES})
    end
  end

  describe '#tooltip' do
    let(:result) { ["query_result"] }

    before { allow(RawSqlRunner).to receive(:execute) { result } }

    it 'should render the correct json' do
      get :tooltip, params: { user_id: teacher.id, completed: true, classroom_unit_id: "", activity_id: "" }
      expect(response.body).to eq({concept_results: result, scores: result}.to_json)
    end
  end
end
