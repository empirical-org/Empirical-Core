# frozen_string_literal: true

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
    let(:student_user) { create(:user) }
    let(:activity_session) { create(:activity_session_without_concept_results, user: student_user) }
    let(:concept) { create(:concept) }
    let!(:concept_result) { create(:concept_result, activity_session: activity_session, concept: concept) }
    let(:due_date) { Time.current }
    let!(:classrooms_teacher) { create(:classrooms_teacher, user: teacher, classroom: activity_session.classroom_unit.classroom) }

    it 'should render the correct json' do
      get :tooltip, params: { user_id: student_user.id, completed: true, classroom_unit_id: activity_session.classroom_unit_id, activity_id: activity_session.activity_id }

      json_response = JSON.parse(response.body).deep_symbolize_keys

      # Due to time-precision rounding on strings, we have to do this comparison
      # in a convoluted way
      expect(json_response[:scores].first).to include(
        percentage: activity_session.percentage
      )
      expect(json_response[:scores].first[:completed_at].to_datetime.to_i)
        .to eq(activity_session.reload.completed_at.to_i + teacher.utc_offset.seconds)

      expect(json_response[:concept_results].first).to include(
        correct: concept_result.correct,
        description: activity_session.activity.description,
        name: concept.name,
        due_date: activity_session.classroom_unit.unit_activities.first.due_date
      )
      expect(json_response[:concept_results].first[:completed_at].to_datetime.to_i)
        .to eq(activity_session.reload.completed_at.to_i + teacher.utc_offset.seconds)
    end
  end
end
