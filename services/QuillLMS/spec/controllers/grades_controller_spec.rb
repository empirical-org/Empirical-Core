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
    let(:concept) { create(:concept_with_grandparent) }
    let(:incorrect_concept_result) { create(:concept_result, activity_session: activity_session, correct: false, concept_id: concept.id, question_score: 1, question_number: 1, extra_metadata: { question_concept_uid: concept.uid }) }
    let(:correct_concept_result) { create(:concept_result, activity_session: activity_session, correct: true, concept_id: concept.id, question_score: 1, question_number: 2, extra_metadata: { question_concept_uid: concept.uid }) }
    let(:due_date) { Time.current }
    let!(:classrooms_teacher) { create(:classrooms_teacher, user: teacher, classroom: activity_session.classroom_unit.classroom) }

    it 'should render the correct json' do
      get :tooltip, params: { user_id: student_user.id, completed: true, classroom_unit_id: activity_session.classroom_unit_id, activity_id: activity_session.activity_id }

      json_response = JSON.parse(response.body).deep_symbolize_keys

      # Due to time-precision rounding on strings, we have to do this comparison
      # in a convoluted way
      expect(json_response[:sessions].first).to include(
        percentage: activity_session.percentage,
        id: activity_session.id,
        description: activity_session.activity.description,
        due_date: activity_session.classroom_unit.unit_activities.first.due_date,
        grouped_key_target_skill_concepts: [{ name: concept.parent.name, correct: 1, incorrect: 1 }],
        number_of_questions: 2,
        number_of_correct_questions: 1
      )
      expect(json_response[:sessions].first[:completed_at].to_datetime.to_i)
        .to eq(activity_session.reload.completed_at.to_i + teacher.utc_offset.seconds)

    end
  end
end
