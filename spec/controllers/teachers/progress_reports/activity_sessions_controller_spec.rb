require 'rails_helper'

describe Teachers::ProgressReports::ActivitySessionsController, :type => :controller do
  let(:teacher) { FactoryGirl.create(:teacher) }
  include_context 'Topic Progress Report'
  it_behaves_like 'Progress Report' do
    let(:result_key) { 'activity_sessions' }
    let(:expected_result_count) { visible_activity_sessions.size }
  end

  context 'XHR GET #index' do
    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }

      before do
        session[:user_id] = teacher.id
      end

      it 'includes the serialized data for activity sessions' do
        xhr :get, :index
        expect(json['activity_sessions'][0]['activity_classification_name']).to_not be_nil
      end

      it 'can filter by classroom' do
        xhr :get, :index, {classroom_id: empty_classroom.id}
        expect(json['activity_sessions'].size).to eq(0)
      end

      it 'can filter by unit' do
        xhr :get, :index, {unit_id: empty_unit.id}
        expect(json['activity_sessions'].size).to eq(0)
      end

      it 'can filter by student' do
        xhr :get, :index, {student_id: zojirushi.id}
        expect(json['activity_sessions'].size).to eq(1)
      end

      it 'fetches classroom, unit, and student data for the filter options' do
        xhr :get, :index
        expect(json['classrooms'].size).to eq(1)
        expect(json['units'].size).to eq(1)
        expect(json['students'].size).to eq(visible_students.size)
      end
    end
  end

end
