require 'rails_helper'

describe GradesController do
  let(:teacher) { create(:teacher) }

  before do
    session[:user_id] = teacher.id
  end

  it { should use_before_action :authorize! }

  describe '#index' do
    it 'should render the correct json' do
      get :index
      expect(JSON.parse response.body).to eq({"grades" => Classroom::GRADES})
    end
  end

  describe '#tooltip' do
    before do
      allow(ActiveRecord::Base.connection).to receive(:execute) { ["query result"] }
    end

    it 'should render the correct json' do
      get :tooltip, user_id: teacher.id, completed: true, classroom_unit_id: ""
      expect(response.body).to eq({concept_results: ["query result"], scores: ["query result"]}.to_json)
    end
  end
end
