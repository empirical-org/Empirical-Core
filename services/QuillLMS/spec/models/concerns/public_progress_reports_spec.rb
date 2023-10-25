# frozen_string_literal: true

require 'rails_helper'

describe PublicProgressReports, type: :model do
  before do
    class FakeReports
      attr_accessor :session
      attr_reader :current_user

      include PublicProgressReports
    end
  end

  describe '#results_by_question' do
    let!(:activity) { create(:evidence_lms_activity) }

    it 'should return an empty array when questions array is empty' do
      report = FakeReports.new
      report.instance_variable_set(:@activity_sessions, [])
      expect(report.results_by_question(activity.id)).to eq []
    end
  end

  describe '#results_for_classroom' do
    let!(:classroom) { create(:classroom) }
    let!(:activity) { create(:evidence_lms_activity) }
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
      cr_directions = create(:concept_result_directions, text: directions)
      cr_prompt = create(:concept_result_prompt, text: 'prompt')
      cr_previous_feedback = create(:concept_result_previous_feedback, text: last_feedback)
      create(:concept_result, activity_session: activity_session_two, attempt_number: 1, answer: 'Arbitrary sample incorrect answer.', correct: false, concept_result_directions: cr_directions, concept_result_prompt: cr_prompt, question_number: 1, question_score: 0.75)
      create(:concept_result, activity_session: activity_session_two, attempt_number: 2, answer: 'Arbitrary sample correct answer.', correct: true, concept_result_previous_feedback: cr_previous_feedback, concept_result_directions: cr_directions, concept_result_prompt: cr_prompt, question_number: 1, question_score: 0.75)
      report = FakeReports.new.results_for_classroom(classroom_unit.unit_id, activity.id, classroom.id)

      expect(report[:students].count).to eq 1
      concept_results = report[:students][0][:concept_results][0][:concepts]
      expect(concept_results.count).to eq 2
      expect(concept_results[1][:directions]).to eq(directions)
      expect(concept_results[1][:lastFeedback]).to eq(last_feedback)
    end

    it 'populates feedback for an evidence activity' do
      activity_session_two = create(:activity_session_without_concept_results, classroom_unit_id: classroom_unit.id, activity_id: activity.id, user: students_classrooms1.student)
      prompt = create(:evidence_prompt, text: "prompt text", conjunction: "but")
      feedback = "This is the current feedback the student is receiving."
      evidence_child_activity = create(:evidence_activity, parent_activity_id: activity.id, prompts: [prompt], target_level: 1, title: "test activity", notes: "note")
      feedback_history = create(:feedback_history, feedback_session_uid: activity_session_two.uid, attempt: 2, prompt: prompt, feedback_text: feedback)

      last_feedback = "This is the last feedback the student received."
      directions = "Combine the sentences."
      cr_directions = create(:concept_result_directions, text: directions)
      cr_prompt = create(:concept_result_prompt, text: prompt.text)
      cr_previous_feedback = create(:concept_result_previous_feedback, text: last_feedback)
      create(:concept_result, activity_session: activity_session_two, attempt_number: 1, answer: 'Arbitrary sample incorrect answer.', correct: false, concept_result_directions: cr_directions, concept_result_prompt: cr_prompt, question_number: 1, question_score: 0.75)
      create(:concept_result, activity_session: activity_session_two, attempt_number: 2, answer: 'Arbitrary sample correct answer.', correct: true, concept_result_previous_feedback: cr_previous_feedback, concept_result_directions: cr_directions, concept_result_prompt: cr_prompt, question_number: 1, question_score: 0.75)
      report = FakeReports.new.results_for_classroom(classroom_unit.unit_id, activity.id, classroom.id)

      expect(report[:students].count).to eq 1
      concept_results = report[:students][0][:concept_results][0][:concepts]
      expect(concept_results.count).to eq 2
      expect(concept_results[1][:directions]).to eq(directions)
      expect(concept_results[1][:lastFeedback]).to eq(last_feedback)
      expect(concept_results[1][:feedback]).to eq(feedback)
    end

    describe "completed activities" do
      before do
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
    let!(:classroom1) { create(:classroom_with_a_couple_students) }
    let!(:classroom_teacher1) { create(:classrooms_teacher, classroom: classroom1, user: teacher) }
    let!(:classroom2) { create(:classroom_with_a_couple_students) }
    let!(:classroom_teacher2) { create(:classrooms_teacher, classroom: classroom2, user: teacher) }
    let!(:classroom_unit1) { create(:classroom_unit, classroom: classroom1, unit: unit)}
    let!(:classroom_unit2) { create(:classroom_unit, classroom: classroom2, unit: unit)}

    context "no students have completed the activity" do
      describe "it is a diagnostic activity" do
        let(:instance) { FakeReports.new }
        let!(:diagnostic) { create(:diagnostic) }
        let!(:diagnostic_activity) { create(:diagnostic_activity) }
        let!(:unit_activity) { create(:unit_activity, activity: diagnostic_activity, unit: unit)}

        before { allow(instance).to receive(:current_user).and_return(teacher) }

        it "should return an array of classrooms that have been assigned the activity" do
          instance.session = { user_id: teacher.id }
          classrooms = instance.classrooms_with_students_for_report(unit.id, diagnostic_activity.id)

          classroom_ids = classrooms.map { |c| c['id'] }
          expect(classroom_ids).to include(classroom1.id)
          expect(classroom_ids).to include(classroom2.id)

          c1_index = classroom_ids.index(classroom1.id)
          c2_index = classroom_ids.index(classroom2.id)

          expect(classrooms[c1_index][:classroom_unit_id]).to eq(classroom_unit1.id)
          expect(classrooms[c2_index][:classroom_unit_id]).to eq(classroom_unit2.id)
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
    let!(:student1) { create(:student) }
    let!(:student2) { create(:student) }
    let!(:student3) { create(:student) }
    let!(:students_classrooms1) { create(:students_classrooms, classroom: classroom, student: student1)}
    let!(:students_classrooms2) { create(:students_classrooms, classroom: classroom, student: student2)}
    let!(:students_classrooms3) { create(:students_classrooms, classroom: classroom, student: student3)}
    let!(:classroom_unit1) { create(:classroom_unit, classroom: classroom, unit: unit1, assigned_student_ids: [student1.id, student2.id] )}

    it 'will only return students who are in the class and have their ids in the assigned array' do
      instance = FakeReports.new
      recommendations = instance.generate_recommendations_for_classroom(unit1.user, unit1.id, classroom.id, diagnostic_activity.id)
      expect(recommendations[:students].find { |s| s[:id] == student1.id}).to be
      expect(recommendations[:students].find { |s| s[:id] == student2.id}).to be
      expect(recommendations[:students].find { |s| s[:id] == student3.id}).not_to be
      expect(recommendations[:students].find { |s| s[:id] == student_not_in_class.id}).not_to be
    end

    it 'will not crash when a relevant student has only one name' do
      student2.update(name: 'First-only')
      instance = FakeReports.new
      expect do
        instance.generate_recommendations_for_classroom(unit1.user, unit1.id, classroom.id, diagnostic_activity.id)
      end.not_to raise_error
    end
  end

  describe '#get_previously_assigned_recommendations_by_classroom' do
    let!(:unit_template1) { create(:unit_template) }
    let!(:unit_template2) { create(:unit_template)}
    let!(:teacher) { create(:teacher) }
    let!(:unit1) { create(:unit, unit_template_id: unit_template1.id, user: teacher) }
    let!(:unit2) { create(:unit, unit_template_id: unit_template2.id, user: teacher) }
    let!(:classroom) { create(:classroom, :with_no_teacher) }
    let!(:classroom2) { create(:classroom) }
    let!(:diagnostic) { create(:diagnostic) }
    let!(:diagnostic_activity) { create(:diagnostic_activity) }
    let!(:recommendation1) { create(:recommendation, activity: diagnostic_activity, unit_template: unit_template1, category: 0)}
    let!(:recommendation2) { create(:recommendation, activity: diagnostic_activity, unit_template: unit_template1, category: 1)}
    let!(:recommendation3) { create(:recommendation, activity: diagnostic_activity, unit_template: unit_template2, category: 1)}
    let!(:unit_activity) { create(:unit_activity, activity: diagnostic_activity, unit: unit1)}
    let!(:student_not_in_class) { create(:student) }
    let!(:student1) { create(:student) }
    let!(:student2) { create(:student) }
    let!(:student3) { create(:student) }
    let!(:students_classrooms1) { create(:students_classrooms, classroom: classroom, student: student1)}
    let!(:students_classrooms2) { create(:students_classrooms, classroom: classroom, student: student2)}
    let!(:students_classrooms3) { create(:students_classrooms, classroom: classroom, student: student3)}
    let!(:classroom_unit1) { create(:classroom_unit, classroom: classroom, unit: unit1, assigned_student_ids: [student1.id, student2.id] )}
    let!(:classroom_unit2) { create(:classroom_unit, classroom: classroom2, unit: unit2, assigned_student_ids: [] )}

    let(:expected_independent_recommendation) do
      {
        activity_count: 0,
        activity_pack_id: unit_template1.id,
        diagnostic_progress: { student1.id => 0, student2.id => 0},
        name: recommendation1.name,
        students: [student1.id, student2.id]
      }
    end

    let(:expected_response) do
      {
        previouslyAssignedIndependentRecommendations: [expected_independent_recommendation],
        previouslyAssignedLessonsRecommendations: [unit_template1.id],
        releaseMethod: release_method
      }
    end

    before { create(:classrooms_teacher, classroom: classroom, user: teacher) }

    subject { FakeReports.new.get_previously_assigned_recommendations_by_classroom(classroom.id, diagnostic_activity.id) }

    context 'no pack sequence exits' do
      let(:release_method) { nil }

      it 'will return previously assigned lesson recommendation only if that classroom has been assigned the lesson' do
        expect(subject.to_json).to eq expected_response.to_json
      end
    end

    context 'pack sequence exists' do
      let(:release_method) { PackSequence::STAGGERED_RELEASE }

      before { create(:pack_sequence, classroom: classroom, diagnostic_activity: diagnostic_activity) }

      it 'will return a release method for previously assigned staggered release PackSequences' do
        expect(subject.to_json).to eq(expected_response.to_json)
      end
    end
  end

  describe '#generic_questions_for_report' do
    let!(:question1) { create(:question) }
    let!(:question2) { create(:question) }
    let!(:question3) { create(:question) }
    let!(:activity) { create(:activity, data: { 'questions' => [{ 'key' => question1.uid }, { 'key' => question2.uid }, { 'key' => question3.uid }] }) }

    context 'Activity.data has no \'questions\' property' do
      let(:questionless_activity) { create(:activity, data: {}) }

      it 'should return an empty array' do
        expect(FakeReports.new.generic_questions_for_report(questionless_activity)).to eq []
      end
    end

    it 'should return an array of question hashes with the relevant information' do
      expected_response = [
        {
          question_id: 1,
          score: nil,
          prompt: question1.data['prompt'],
          instructions: question1.data['instructions']
        },
        {
          question_id: 2,
          score: nil,
          prompt: question2.data['prompt'],
          instructions: question2.data['instructions']
        },
        {
          question_id: 3,
          score: nil,
          prompt: question3.data['prompt'],
          instructions: question3.data['instructions']
        }
      ]

      expect(FakeReports.new.generic_questions_for_report(activity).to_json).to eq(expected_response.to_json)

    end
  end

  describe '#assigned_student_ids_for_classroom_and_units' do
    let!(:unit1) { create(:unit) }
    let!(:unit2) { create(:unit) }
    let!(:classroom) { create(:classroom) }

    let!(:student1) { create(:student) }
    let!(:student2) { create(:student) }
    let!(:student3) { create(:student) }
    let!(:student4) { create(:student) }
    let!(:students_classrooms1) { create(:students_classrooms, classroom: classroom, student: student1)}
    let!(:students_classrooms2) { create(:students_classrooms, classroom: classroom, student: student2)}
    let!(:students_classrooms3) { create(:students_classrooms, classroom: classroom, student: student3)}
    let!(:students_classrooms4) { create(:students_classrooms, classroom: classroom, student: student4)}
    let!(:classroom_unit1) { create(:classroom_unit, classroom: classroom, unit: unit1, assigned_student_ids: [student1.id, student2.id] )}
    let!(:classroom_unit2) { create(:classroom_unit, classroom: classroom, unit: unit2, assigned_student_ids: [student2.id, student3.id] )}

    it 'returns a flattened and unique-d array of all the assigned student ids for that classroom and those units' do
      expect(
        Set.new(FakeReports.new.assigned_student_ids_for_classroom_and_units(classroom, [unit1, unit2]))
      ).to(
        eq(Set[student1.id, student2.id, student3.id])
      )
    end
  end

  describe '#get_key_target_skill_concept_for_question' do
    let!(:default ) {
      {
        name: 'Conventions of Language',
        correct: true
      }
    }

    let!(:evidence_default) {
      {
        name: 'Writing with Evidence',
        correct: true
      }
    }

    it 'should return a default key target skill concept if the first concept result has no extra metadata' do
      concept_result =  create(:concept_result)

      expect(FakeReports.new.get_key_target_skill_concept_for_question([concept_result])).to eq(default)
    end

    it 'should return the evidence default key target skill concept if the first concept result has no extra metadata and it was an evidence session' do
      concept_result =  create(:concept_result)

      expect(FakeReports.new.get_key_target_skill_concept_for_question([concept_result], true)).to eq(evidence_default)
    end

    it 'should return a default key target skill concept if the first concept result does not have a question_concept_uid' do
      concept_result =  create(:concept_result, extra_metadata: { question_uid: 'blah' })

      expect(FakeReports.new.get_key_target_skill_concept_for_question([concept_result])).to eq(default)
    end

    it 'should return a default key target skill concept if the first concept result has a question_concept_uid that is not in the database' do
      concept_result =  create(:concept_result, extra_metadata: { question_concept_uid: 'blah' })

      expect(FakeReports.new.get_key_target_skill_concept_for_question([concept_result])).to eq(default)
    end

    it 'should return a key target skill concept with the parent of the question\'s concept that is correct if the student reached an optimal response' do
      concept =  create(:concept_with_grandparent)
      incorrect_concept_result =  create(:concept_result, correct: false, concept_id: concept.id, question_score: 1, extra_metadata: { question_concept_uid: concept.uid })
      correct_concept_result =  create(:concept_result, correct: true, concept_id: concept.id, question_score: 1, extra_metadata: { question_concept_uid: concept.uid })

      expected = {
        id: concept.parent.id,
        uid: concept.parent.uid,
        correct: true,
        name: concept.parent.name
      }

      expect(FakeReports.new.get_key_target_skill_concept_for_question([incorrect_concept_result, correct_concept_result])).to eq(expected)
    end

    it 'should return a key target skill concept with the parent of the question\'s concept that is incorrect if the student did not reach an optimal response' do
      concept =  create(:concept_with_grandparent)
      incorrect_concept_result =  create(:concept_result, correct: false, concept_id: concept.id, extra_metadata: { question_concept_uid: concept.uid })

      expected = {
        id: concept.parent.id,
        uid: concept.parent.uid,
        correct: false,
        name: concept.parent.name
      }

      expect(FakeReports.new.get_key_target_skill_concept_for_question([incorrect_concept_result])).to eq(expected)
    end

  end
end
