# frozen_string_literal: true

require 'rails_helper'

describe Teachers::ProgressReports::DiagnosticReportsController, type: :controller do
  include_context "Unit Assignments Variables"
  let(:activity) { create(:diagnostic_activity) }
  let(:unit) {create(:unit)}
  let(:classroom) {create(:classroom)}

  before { session[:user_id] = teacher.id }

  describe 'getting the report for a completed activity session' do
    describe 'updating existing recommendations' do
      let(:unit) {create(:unit)}
      let(:activity) { create(:activity)}
      let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
      let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity)}
      let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, user: student) }

      it "redirects to the correct page" do
        get :report_from_classroom_unit_and_activity_and_user, params: ({classroom_unit_id: classroom_unit.id, user_id: student.id, activity_id: activity.id})
        expect(response).to redirect_to("/teachers/progress_reports/diagnostic_reports#/u/#{unit.id}/a/#{activity.id}/c/#{classroom.id}/student_report/#{student.id}")
      end
    end
  end

  describe '#redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit' do
    describe 'when the activity is a diagnostic' do
      describe 'pre-test without a post test' do
        let(:unit) {create(:unit)}
        let(:activity) { create(:diagnostic_activity)}
        let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
        let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity)}
        let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, user: student) }

        it 'responds with a summary link' do
          get :redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit, params: ({unit_id: unit.id, activity_id: activity.id})
          expect(response.body).to eq({ url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity.id}/classroom/#{classroom.id}/summary?unit=#{unit.id}"}.to_json)
        end
      end

      describe 'pre-test with a post-test' do
        let(:unit) {create(:unit)}
        let(:post_test) { create(:diagnostic_activity)}
        let(:activity) { create(:diagnostic_activity, follow_up_activity_id: post_test.id)}
        let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
        let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity)}
        let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, user: student) }

        it 'responds with a summary link' do
          get :redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit, params: ({unit_id: unit.id, activity_id: activity.id})
          expect(response.body).to eq({ url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity.id}/classroom/#{classroom.id}/summary?unit=#{unit.id}"}.to_json)
        end
      end

      describe 'post-test' do
        let(:unit) {create(:unit)}
        let(:activity) { create(:diagnostic_activity)}
        let!(:pre_test) { create(:diagnostic_activity, follow_up_activity_id: activity.id)}
        let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
        let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity)}
        let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, user: student) }

        it 'responds with a growth_summary link' do
          get :redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit, params: ({unit_id: unit.id, activity_id: activity.id})
          expect(response.body).to eq({ url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity.id}/classroom/#{classroom.id}/growth_summary?unit=#{unit.id}"}.to_json)
        end
      end

      describe 'neither pre-test nor post-test' do
        let(:unit) {create(:unit)}
        let(:activity) { create(:diagnostic_activity)}
        let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
        let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity)}
        let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, user: student) }

        it 'responds with a summary link that has a unit query param' do
          get :redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit, params: ({unit_id: unit.id, activity_id: activity.id})
          expect(response.body).to eq({ url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity.id}/classroom/#{classroom.id}/summary?unit=#{unit.id}"}.to_json)
        end

      end

    end
  end

  context '#students_by_classroom' do
    let!(:student1) { create(:user, classcode: classroom.code) }
    let!(:student2) { create(:user, classcode: classroom.code) }
    let!(:student3) { create(:user, classcode: classroom.code) }
    let!(:cu) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: [student1.id, student2.id, student3.id])}
    let!(:ua) { create(:unit_activity, unit: unit, activity: activity)}

    it 'should cache results so that they are only calculated once' do
      expect_any_instance_of(Teachers::ProgressReports::DiagnosticReportsController).to receive(:results_for_classroom).with(unit.id.to_s, activity.id.to_s, classroom.id.to_s).once.and_call_original
      2.times do
        get :students_by_classroom, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

        expect(response).to be_successful
      end
    end

    it 'should return empty arrays when there are no activity_sessions' do
      get :students_by_classroom, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

      expect(response).to be_successful

      json = JSON.parse(response.body)

      expect(json['id']).to eq(classroom.id)
      expect(json['name']).to eq(classroom.name)

      expect(json['students']).to be_empty
      expect(json['not_completed_names']).to be_empty
      expect(json['missed_names']).to be_empty
    end

    context 'with activity_sessions' do
      before do
        create(:activity_session, :finished, user: student1, activity: activity, classroom_unit: cu)
        create(:activity_session, :started, user: student2, activity: activity, classroom_unit: cu)
      end

      it 'should return report data for students and not_completed_name' do
        get :students_by_classroom, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

        expect(response).to be_successful

        json = JSON.parse(response.body)

        expect(json['id']).to eq(classroom.id)
        expect(json['name']).to eq(classroom.name)

        expect(json['students'].count).to eq(1)
        expect(json['students'].first['id']).to eq(student1.id)
        expect(json['students'].first['average_score_on_quill']).to eq(0)

        expect(json['not_completed_names'].count).to eq(1)
        expect(json['not_completed_names'].first).to eq(student2.name)

        expect(json['missed_names']).to be_empty
      end

      context 'when ClassroomUnitActivityState completed' do
        before do
          create(:classroom_unit_activity_state, completed: true, classroom_unit: cu, unit_activity: ua)
        end

        it 'should return report data for students and missing_name' do
          get :students_by_classroom, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

          expect(response).to be_successful

          json = JSON.parse(response.body)

          expect(json['id']).to eq(classroom.id)
          expect(json['name']).to eq(classroom.name)

          expect(json['students'].count).to eq(1)
          expect(json['students'].first['id']).to eq(student1.id)

          expect(json['not_completed_names']).to be_empty

          expect(json['missed_names'].count).to eq(1)
          expect(json['missed_names'].first).to eq(student2.name)
        end
      end

      context 'with multiple graded and non-graded activities' do
        before do
          create(:grammar_activity_session, :finished, user: student1, percentage: 0.60)
          create(:grammar_activity_session, :finished, user: student1, percentage: 0.50)

          create(:activity_session, :finished, user: student2, activity: activity, classroom_unit: cu)
          create(:activity_session, :finished, user: student3, activity: activity, classroom_unit: cu)
        end

        it 'should return all 3 records and average score' do
          get :students_by_classroom, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

          expect(response).to be_successful

          json = JSON.parse(response.body)

          expect(json['students'].count).to eq(3)
          expect(json['students'].first['average_score_on_quill']).to eq(55)
        end
      end
    end
  end

  context '#classrooms_with_students' do
    let!(:student1) { create(:user, classcode: classroom.code) }
    let!(:student2) { create(:user, classcode: classroom.code) }
    let!(:student3) { create(:user, classcode: classroom.code) }
    let!(:cu) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: [student1.id, student2.id, student3.id])}
    let!(:ua) { create(:unit_activity, unit: unit, activity: activity)}

    it 'should return empty arrays when there are no activity_sessions' do
      get :classrooms_with_students, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

      json = JSON.parse(response.body)

      expect(json.count).to eq 1
      expect(json.first.key?('students')).to be false
    end

    context 'with activity_sessions' do
      before do
        create(:activity_session, :finished, user: student1, activity: activity, classroom_unit: cu)
        create(:activity_session, :finished, user: student2, activity: activity, classroom_unit: cu)
        # the started student is not returned
        create(:activity_session, :started, user: student3, activity: activity, classroom_unit: cu)
      end

      after do
        Rails.cache.clear
      end

      it 'should return report data for completed student sessions' do
        Rails.logger.info "\n\n\nStart"
        get :classrooms_with_students, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

        expect(response).to be_successful

        json = JSON.parse(response.body)

        expect(json.count).to eq 1
        expect(json.first['students'].count).to eq 2
      end

      it 'should cache response data' do
        expect(controller).to receive(:classrooms_with_students_for_report).with(any_args).once.and_call_original

        2.times do
          get :classrooms_with_students, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

          expect(response).to be_successful

          json = JSON.parse(response.body)

          expect(json.count).to eq 1
          expect(json.first['students'].count).to eq 2
        end
      end
    end
  end

  context 'lesson_recommendations_for_classroom' do
    before do
      # stub complicated query that returns activities
      allow_any_instance_of(LessonRecommendationsQuery).to receive(:activity_recommendations).and_return([activity])
      @classroom_unit = create(:classroom_unit, classroom: classroom, unit: unit)
    end

    it 'should not error with no activity_sessions' do
      get :lesson_recommendations_for_classroom, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

      expect(response).to be_successful
    end

    it 'should not error with activity_sessions' do
      create(:activity_session, classroom_unit: @classroom_unit, activity: activity)
      get :lesson_recommendations_for_classroom, params: ({activity_id: activity.id, unit_id: unit.id, classroom_id: classroom.id})

      expect(response).to be_successful
    end
  end

  describe 'assign_selected_packs recommendations' do
    let(:unit_template_ids) { [unit_template1, unit_template2, unit_template3, unit_template4].map(&:id) }

    let(:selections) do
      unit_template_ids.map do |unit_template_id|
       {
         id: unit_template_id,
         classrooms: [
           {
             id: classroom.id,
             student_ids: []
           }
         ]
       }
     end
    end

    it 'creates units but does not create new classroom activities if passed no students ids' do
      post "assign_selected_packs",
        params: { selections: selections },
        as: :json

      expect(unit_templates_have_a_corresponding_unit?(unit_template_ids)).to eq(true)
      expect(units_have_corresponding_unit_activities?(unit_template_ids)).to eq(false)
    end
  end

  describe 'skills_growth' do
    let!(:pre_test_unit) { create(:unit) }
    let!(:post_test_unit) { create(:unit, user: pre_test_unit.user) }
    let!(:classroom) { create(:classroom) }
    let!(:student1) { create(:student, name: 'Alphabetical A')}
    let!(:students_classroom1) { create(:students_classrooms, classroom: classroom, student: student1)}
    let!(:student2) { create(:student, name: 'Alphabetical B')}
    let!(:students_classroom2) { create(:students_classrooms, classroom: classroom, student: student2)}
    let!(:pre_test_classroom_unit) { create(:classroom_unit, unit: pre_test_unit, classroom: classroom, assigned_student_ids: [student1.id, student2.id]) }
    let!(:pre_test_unit_activity) { create(:unit_activity, unit: pre_test_unit) }
    let!(:post_test_classroom_unit) { create(:classroom_unit, unit: post_test_unit, classroom: classroom, assigned_student_ids: [student1.id, student2.id]) }
    let!(:post_test_unit_activity) { create(:unit_activity, unit: post_test_unit) }
    let!(:pre_test_skill_group_activity) { create(:skill_group_activity, activity: pre_test_unit_activity.activity)}
    let!(:post_test_skill_group_activity) { create(:skill_group_activity, activity: post_test_unit_activity.activity, skill_group: pre_test_skill_group_activity.skill_group)}
    let!(:pre_test_activity_session) { create(:activity_session, :finished, user: student1, classroom_unit: pre_test_classroom_unit, activity: pre_test_unit_activity.activity) }
    let!(:post_test_activity_session) { create(:activity_session, :finished, user: student1, classroom_unit: post_test_classroom_unit, activity: post_test_unit_activity.activity) }
    let!(:post_test_activity_session_with_no_pre_test) { create(:activity_session, :finished, user: student2, classroom_unit: post_test_classroom_unit, activity: post_test_unit_activity.activity) }
    let!(:concept) { create(:concept) }
    let!(:skill) { create(:skill, skill_group: pre_test_skill_group_activity.skill_group) }
    let!(:skill_concept) { create(:skill_concept, concept: concept, skill: skill) }
    let!(:pre_test_correct_concept_result) { create(:old_concept_result_with_correct_answer, concept: concept, activity_session: pre_test_activity_session) }
    let!(:post_test_correct_concept_result) { create(:old_concept_result_with_correct_answer, concept: concept, activity_session: post_test_activity_session) }
    let!(:pre_test_incorrect_concept_result) { create(:old_concept_result_with_incorrect_answer, concept: concept, activity_session: pre_test_activity_session) }

    it 'should return the total number of acquired skills' do
      get :skills_growth, params: ({classroom_id: classroom.id, post_test_activity_id: post_test_unit_activity.activity_id, pre_test_activity_id: pre_test_unit_activity.activity_id})

      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['skills_growth']).to eq 1
    end

  end
end
