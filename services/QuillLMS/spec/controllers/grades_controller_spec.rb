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
    let(:activity_session) { create(:activity_session, user: student_user) }
    let(:concept) { create(:concept) }
    let!(:concept_result) { create(:concept_result, activity_session: activity_session, concept: concept) }
    let(:due_date) { Time.current }
    let!(:classrooms_teacher) { create(:classrooms_teacher, user: teacher, classroom: activity_session.classroom_unit.classroom) }
    let(:timestamp_format) { '%Y-%m-%d %H:%M:%S.%6N' }

    it 'should render the correct json' do
      get :tooltip, params: { user_id: student_user.id, completed: true, classroom_unit_id: activity_session.classroom_unit_id, activity_id: activity_session.activity_id }
      expect(JSON.parse(response.body).deep_symbolize_keys).to eq({
        concept_results: [{
          correct: concept_result.correct,
          description: activity_session.activity.description,
          name: concept.name,
          completed_at: activity_session.completed_at.strftime(timestamp_format),
          due_date: activity_session.classroom_unit.unit_activities.first.due_date
        }],
        scores: [{
          percentage: activity_session.percentage,
          completed_at: activity_session.completed_at.strftime(timestamp_format)
        }]
      })
    end
  end
end
