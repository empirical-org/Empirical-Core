# frozen_string_literal: true

require 'rails_helper'

describe PublicProgressReports, type: :model do

  before(:each) do
    class FakeReports
      attr_accessor :session

      include PublicProgressReports
    end
  end

  describe '#results_for_classroom' do
    let!(:classroom) { create(:classroom) }
    let!(:activity) { create(:evidence_activity) }
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, assign_on_join: true) }
    let!(:students_classrooms1) { create(:students_classrooms, classroom: classroom)}
    let!(:students_classrooms2) { create(:students_classrooms, classroom: classroom)}
    let!(:students_classrooms3) { create(:students_classrooms, classroom: classroom)}
    let!(:activity_session) {create(:activity_session, classroom_unit_id: classroom_unit.id, activity_id: activity.id, user: students_classrooms1.student) }
    let!(:unfinished_session) { create(:activity_session, classroom_unit_id: classroom_unit.id, activity_id: activity.id, state: 'started', is_final_score: false, user: students_classrooms2.student) }

    it 'fill report' do
      report = FakeReports.new.results_for_classroom(classroom_unit.unit_id, activity.id, classroom.id)

      expect(report[:students].count).to be 1
      expect(report[:name]).to eq(classroom.name)
      expect(report[:not_completed_names].first).to eq(students_classrooms2.student.name)
      expect(report[:missed_names].first).to be nil
    end

    it 'populates directions and last feedback' do
      activity_session_two = create(:activity_session_without_concept_results, classroom_unit_id: classroom_unit.id, activity_id: activity.id, user: students_classrooms1.student)

      last_feedback = "This is the last feedback the student received."
      directions = "Combine the sentences."
      create(:concept_result, activity_session: activity_session_two, metadata: { "attemptNumber": 1, "answer": 'Arbitrary sample incorrect answer.', "correct": 0, "directions": directions, "prompt": "prompt", "questionNumber": 1, "questionScore": 0.75})
      create(:concept_result, activity_session: activity_session_two, metadata: { "attemptNumber": 2, "answer": 'Arbitrary sample correct answer.', "correct": 1, "lastFeedback": last_feedback, "directions": directions, "prompt": "prompt", "questionNumber": 1, "questionScore": 0.75})
      report = FakeReports.new.results_for_classroom(classroom_unit.unit_id, activity.id, classroom.id)

      expect(report[:students].count).to eq 1
      concept_results = report[:students][0][:concept_results][0][:concepts]
      expect(concept_results.count).to eq 2
      expect(concept_results[1][:directions]).to eq(directions)
      expect(concept_results[1][:lastFeedback]).to eq(last_feedback)
    end

    it 'populates feedback for an evidence activity' do
      activity_session_two = create(:activity_session_without_concept_results, classroom_unit_id: classroom_unit.id, activity_id: activity.id, user: students_classrooms1.student)
      prompt = Evidence::Prompt.create(text: "prompt text", conjunction: "but")
      feedback = "This is the current feedback the student is receiving."
      evidence_child_activity = Evidence::Activity.create(parent_activity_id: activity.id, prompts: [prompt], target_level: 1, title: "test activity", notes: "note")
      feedback_history = create(:feedback_history, feedback_session_uid: activity_session_two.uid, attempt: 2, prompt: prompt, feedback_text: feedback)

      last_feedback = "This is the last feedback the student received."
      directions = "Combine the sentences."
      create(:concept_result, activity_session: activity_session_two, metadata: { "attemptNumber": 1, "answer": 'Arbitrary sample incorrect answer.', "correct": 0, "directions": directions, "prompt": "prompt text", "questionNumber": 1, "questionScore": 0.75})
      create(:concept_result, activity_session: activity_session_two, metadata: { "attemptNumber": 2, "answer": 'Arbitrary sample correct answer.', "correct": 1, "lastFeedback": last_feedback, "directions": directions, "prompt": "prompt text", "questionNumber": 1, "questionScore": 0.75})
      report = FakeReports.new.results_for_classroom(classroom_unit.unit_id, activity.id, classroom.id)

      expect(report[:students].count).to eq 1
      concept_results = report[:students][0][:concept_results][0][:concepts]
      expect(concept_results.count).to eq 2
      expect(concept_results[1][:directions]).to eq(directions)
      expect(concept_results[1][:lastFeedback]).to eq(last_feedback)
      expect(concept_results[1][:feedback]).to eq(feedback)
    end

    describe "completed activities" do
      before(:each) do
        unit_activity = UnitActivity.where(activity: activity, unit: classroom_unit.unit).first
        create(:classroom_unit_activity_state, completed: true, classroom_unit: classroom_unit, unit_activity: unit_activity)
      end

      it 'should fill report and mark names as missing' do
        report = FakeReports.new.results_for_classroom(classroom_unit.unit_id, activity.id, classroom.id)

        expect(report[:students].count).to be 1
        expect(report[:name]).to eq(classroom.name)
        expect(report[:missed_names].first).to eq(students_classrooms2.student.name)
      end
    end
  end

  describe '#activity_session_report' do
    describe 'when the activity is a diagnostic' do
      let(:classroom) {create(:classroom)}
      let(:student) { create(:student)}

      describe 'pre-test' do
        let(:unit) {create(:unit)}
        let(:post_test) { create(:diagnostic_activity)}
        let(:activity) { create(:diagnostic_activity, follow_up_activity_id: post_test.id)}
        let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
        let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity)}
        let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, user: student) }

        it 'responds with a link' do
          expect(FakeReports.new.activity_session_report(unit.id, classroom.id, student.id, activity.id)).to eq({ url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity.id}/classroom/#{classroom.id}/responses/#{student.id}?unit=#{unit.id}"})
        end
      end

      describe 'post-test' do
        let(:unit) {create(:unit)}
        let(:activity) { create(:diagnostic_activity)}
        let!(:pre_test) { create(:diagnostic_activity, follow_up_activity_id: activity.id)}
        let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
        let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity)}
        let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, user: student) }

        it 'responds with a link' do
          expect(FakeReports.new.activity_session_report(unit.id, classroom.id, student.id, activity.id)).to eq({ url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity.id}/classroom/#{classroom.id}/responses/#{student.id}?unit=#{unit.id}"})
        end
      end

      describe 'neither pre-test nor post-test' do
        let(:unit) {create(:unit)}
        let(:activity) { create(:diagnostic_activity)}
        let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
        let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity)}
        let!(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, user: student) }

        it 'responds with a link' do
          expect(FakeReports.new.activity_session_report(unit.id, classroom.id, student.id, activity.id)).to eq({ url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity.id}/classroom/#{classroom.id}/responses/#{student.id}?unit=#{unit.id}"})
        end

      end

    end

  end

  describe "#classrooms_with_students_for_report" do
    let!(:teacher) { create(:teacher) }
    let!(:unit) { create(:unit, user: teacher) }
    let!(:classroom_1) { create(:classroom_with_a_couple_students) }
    let!(:classroom_teacher_1) { create(:classrooms_teacher, classroom: classroom_1, user: teacher) }
    let!(:classroom_2) { create(:classroom_with_a_couple_students) }
    let!(:classroom_teacher_2) { create(:classrooms_teacher, classroom: classroom_2, user: teacher) }
    let!(:classroom_unit_1) { create(:classroom_unit, classroom: classroom_1, unit: unit)}
    let!(:classroom_unit_2) { create(:classroom_unit, classroom: classroom_2, unit: unit)}

    context "no students have completed the activity" do
      describe "it is a diagnostic activity" do
        let!(:diagnostic) { create(:diagnostic) }
        let!(:diagnostic_activity) { create(:diagnostic_activity) }
        let!(:unit_activity) { create(:unit_activity, activity: diagnostic_activity, unit: unit)}

        it "should return an array of classrooms that have been assigned the activity" do
          instance = FakeReports.new
          instance.session = { user_id: teacher.id }
          classrooms = instance.classrooms_with_students_for_report(unit.id, diagnostic_activity.id)

          classroom_ids = classrooms.map { |c| c['id'] }
          expect(classroom_ids).to include(classroom_1.id)
          expect(classroom_ids).to include(classroom_2.id)

          c1_index = classroom_ids.index(classroom_1.id)
          c2_index = classroom_ids.index(classroom_2.id)

          expect(classrooms[c1_index][:classroom_unit_id]).to eq(classroom_unit_1.id)
          expect(classrooms[c2_index][:classroom_unit_id]).to eq(classroom_unit_2.id)


        end
      end
    end
  end

  describe "#generate_recommendations_for_classroom" do
    let!(:unit_template1) { create(:unit_template) }
    let!(:unit1) { create(:unit, unit_template_id: unit_template1.id) }
    let!(:unit2) { create(:unit, unit_template_id: unit_template1.id) }
    let!(:classroom) { create(:classroom) }
    let!(:diagnostic) { create(:diagnostic) }
    let!(:diagnostic_activity) { create(:diagnostic_activity) }
    let!(:unit_activity) { create(:unit_activity, activity: diagnostic_activity, unit: unit1)}
    let!(:student_not_in_class) { create(:student) }
    let!(:student_1) { create(:student) }
    let!(:student_2) { create(:student) }
    let!(:student_3) { create(:student) }
    let!(:students_classrooms_1) { create(:students_classrooms, classroom: classroom, student: student_1)}
    let!(:students_classrooms_2) { create(:students_classrooms, classroom: classroom, student: student_2)}
    let!(:students_classrooms_3) { create(:students_classrooms, classroom: classroom, student: student_3)}
    let!(:classroom_unit_1) { create(:classroom_unit, classroom: classroom, unit: unit1, assigned_student_ids: [student_1.id, student_2.id] )}

    it 'will only return students who are in the class and have their ids in the assigned array' do
      instance = FakeReports.new
      recommendations = instance.generate_recommendations_for_classroom(unit1.user, unit1.id, classroom.id, diagnostic_activity.id)
      expect(recommendations[:students].find { |s| s[:id] == student_1.id}).to be
      expect(recommendations[:students].find { |s| s[:id] == student_2.id}).to be
      expect(recommendations[:students].find { |s| s[:id] == student_3.id}).not_to be
      expect(recommendations[:students].find { |s| s[:id] == student_not_in_class.id}).not_to be
    end
  end

  describe '#get_previously_assigned_recommendations_by_classroom' do
    let!(:unit_template1) { create(:unit_template) }
    let!(:unit_template2) { create(:unit_template)}
    let!(:teacher) { create(:teacher) }
    let!(:unit1) { create(:unit, unit_template_id: unit_template1.id, user: teacher) }
    let!(:unit2) { create(:unit, unit_template_id: unit_template2.id, user: teacher) }
    let!(:classroom) { create(:classroom) }
    let!(:classroom2) { create(:classroom) }
    let!(:diagnostic) { create(:diagnostic) }
    let!(:diagnostic_activity) { create(:diagnostic_activity) }
    let!(:recommendation) { create(:recommendation, activity: diagnostic_activity, unit_template: unit_template1, category: 1)}
    let!(:recommendation2) { create(:recommendation, activity: diagnostic_activity, unit_template: unit_template2, category: 1)}
    let!(:unit_activity) { create(:unit_activity, activity: diagnostic_activity, unit: unit1)}
    let!(:student_not_in_class) { create(:student) }
    let!(:student_1) { create(:student) }
    let!(:student_2) { create(:student) }
    let!(:student_3) { create(:student) }
    let!(:students_classrooms_1) { create(:students_classrooms, classroom: classroom, student: student_1)}
    let!(:students_classrooms_2) { create(:students_classrooms, classroom: classroom, student: student_2)}
    let!(:students_classrooms_3) { create(:students_classrooms, classroom: classroom, student: student_3)}
    let!(:classroom_unit_1) { create(:classroom_unit, classroom: classroom, unit: unit1, assigned_student_ids: [student_1.id, student_2.id] )}
    let!(:classroom_unit_2) { create(:classroom_unit, classroom: classroom2, unit: unit2, assigned_student_ids: [] )}

    it 'will return previously assigned lesson recommendation only if that classroom has been assigned the lesson' do
      create(:classrooms_teacher, classroom: classroom, user: teacher)
      expected_response = {
        previouslyAssignedIndependentRecommendations: [],
        previouslyAssignedLessonsRecommendations: [unit_template1.id]
      }
      expect(FakeReports.new.get_previously_assigned_recommendations_by_classroom(classroom.id, diagnostic_activity.id).to_json).to eq(expected_response.to_json)
    end

  end

  describe '#generic_questions_for_report' do
    let!(:question_1) { create(:question) }
    let!(:question_2) { create(:question) }
    let!(:question_3) { create(:question) }
    let!(:activity) { create(:activity, data: { 'questions' => [{ 'key' => question_1.uid }, { 'key' => question_2.uid }, { 'key' => question_3.uid }] }) }

    it 'should return an array of question hashes with the relevant information' do
      expected_response = [
        {
          question_id: 1,
          score: nil,
          prompt: question_1.data['prompt'],
          instructions: question_1.data['instructions']
        },
        {
          question_id: 2,
          score: nil,
          prompt: question_2.data['prompt'],
          instructions: question_2.data['instructions']
        },
        {
          question_id: 3,
          score: nil,
          prompt: question_3.data['prompt'],
          instructions: question_3.data['instructions']
        }
      ]

      expect(FakeReports.new.generic_questions_for_report(activity.id).to_json).to eq(expected_response.to_json)

    end
  end
end
