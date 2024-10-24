# frozen_string_literal: true

require 'rails_helper'

describe DiagnosticReports do
  include DiagnosticReports

  describe '#data_for_question_by_activity_session' do
    let!(:activity_session) { create(:activity_session_without_concept_results) }
    let!(:skill_group_activity) { create(:skill_group_activity, activity: activity_session.activity) }
    let!(:diagnostic_question_skill) { create(:diagnostic_question_skill, skill_group: skill_group_activity.skill_group) }
    let!(:correct_concept_result) { create(:concept_result, activity_session: activity_session, correct: true, question_number: 1, extra_metadata: { question_uid: diagnostic_question_skill.question.uid }) }

    it 'should return data with the name of the skill, number of correct concept results, number of incorrect concept results, and a summary' do
      expect(data_for_question_by_activity_session(activity_session.concept_results, diagnostic_question_skill)).to eq({
        id: diagnostic_question_skill.id,
        name: diagnostic_question_skill.name,
        number_correct: 1,
        number_incorrect: 0,
        proficiency_score: 1,
        question_uid: diagnostic_question_skill.question.uid,
        summary: DiagnosticReports::FULLY_CORRECT
      })
    end
  end

  describe '#summarize_correct_skills' do
    it 'should return NOT_PRESENT if both number_correct and number_incorrect are 0' do
      expect(summarize_correct_skills(0, 0)).to eq(DiagnosticReports::NOT_PRESENT)
    end

    it 'should return NOT_CORRECT if number_correct is 0 and number_incorrect is not 0' do
      expect(summarize_correct_skills(0, 1)).to eq(DiagnosticReports::NOT_CORRECT)
    end

    it 'should return FULLY_CORRECT if number_correct is 0 and number_incorrect is not 0' do
      expect(summarize_correct_skills(1, 0)).to eq(DiagnosticReports::FULLY_CORRECT)
    end

    it 'should return PARTIALLY_CORRECT if neither number_correct nor number_incorrect is 0' do
      expect(summarize_correct_skills(1, 1)).to eq(DiagnosticReports::PARTIALLY_CORRECT)
    end
  end

  describe '#calculate_proficiency_score' do
    subject { calculate_proficiency_score(number_correct, number_incorrect) }

    context 'undefined scores' do
      let(:number_correct) { 0 }
      let(:number_incorrect) { 0 }

      it { expect(subject).to eq DiagnosticReports::NOT_PRESENT }
    end

    context 'zero correct' do
      let(:number_correct) { 0 }
      let(:number_incorrect) { 1 }

      it { expect(subject).to eq 0 }
    end

    context 'zero incorrect' do
      let(:number_correct) { 1 }
      let(:number_incorrect) { 0 }

      it { expect(subject).to eq 1 }
    end

    context 'nonzero correct and incorrect' do
      let(:number_correct) { 1 }
      let(:number_incorrect) { 1 }

      it { expect(subject).to eq 0 }
    end
  end

  describe '#set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit' do
    describe 'if there is a unit_id' do
      let!(:unit) { create(:unit) }
      let!(:classroom) { create(:classroom) }
      let!(:student1) { create(:student, name: 'Alphabetical A') }
      let!(:student2) { create(:student, name: 'Alphabetical B') }
      let!(:student3) { create(:student, name: 'Alphabetical C') }
      let!(:students_classroom1) { create(:students_classrooms, classroom: classroom, student: student1) }
      let!(:students_classroom2) { create(:students_classrooms, classroom: classroom, student: student2) }
      let!(:students_classroom3) { create(:students_classrooms, classroom: classroom, student: student3) }
      let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom, assigned_student_ids: [student1.id, student2.id, student3.id]) }
      let!(:unit_activity) { create(:unit_activity, unit: unit) }
      let!(:unrelated_unit_activity) { create(:unit_activity) }

      let!(:activity_session1) { create(:activity_session, :finished, user: student1, classroom_unit: classroom_unit, activity: unit_activity.activity) }
      let!(:activity_session2) { create(:activity_session, :finished, user: student2, classroom_unit: classroom_unit, activity: unit_activity.activity) }
      let!(:unrelated_activity_session) do
        create(:activity_session, :finished, user: student2, classroom_unit: classroom_unit, activity: unrelated_unit_activity.activity)
      end

      it 'should set the variables for all the final score activity sessions for that activity, classroom, and unit' do
        set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(unit_activity.activity_id, classroom.id, unit.id)
        expect(@assigned_students).to include(student1, student2, student3)
        expect(@activity_sessions).to include(activity_session1, activity_session2)
      end

      it 'should only return activity sessions belonging to the specified activity' do
        set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(unit_activity.activity_id, classroom.id, unit.id)
        expect(@activity_sessions.count).to eq 2
        expect(@activity_sessions.filter { |as| as.id == unrelated_activity_session.id }).to eq []
      end

      it 'should not include a student or their activity session if they are no longer in the assigned student ids array' do
        classroom_unit.remove_assigned_student(student1.id)
        classroom_unit.reload
        set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(unit_activity.activity_id, classroom.id, unit.id)
        expect(@assigned_students).to include(student2, student3)
        expect(@activity_sessions).to include(activity_session2)
      end
    end

    describe 'if there is no unit_id' do
      let!(:unit1) { create(:unit) }
      let!(:unit2) { create(:unit, user: unit1.user) }
      let!(:classroom) { create(:classroom) }
      let!(:student1) { create(:student, name: 'Alphabetical A') }
      let!(:student2) { create(:student, name: 'Alphabetical B') }
      let!(:student3) { create(:student, name: 'Alphabetical C') }
      let!(:students_classroom1) { create(:students_classrooms, classroom: classroom, student: student1) }
      let!(:students_classroom2) { create(:students_classrooms, classroom: classroom, student: student2) }
      let!(:students_classroom3) { create(:students_classrooms, classroom: classroom, student: student3) }
      let!(:classroom_unit1) { create(:classroom_unit, unit: unit1, classroom: classroom, assigned_student_ids: [student1.id, student2.id]) }
      let!(:classroom_unit2) { create(:classroom_unit, unit: unit2, classroom: classroom, assigned_student_ids: [student2.id, student3.id]) }
      let!(:unit_activity1) { create(:unit_activity, unit: unit1) }
      let!(:unit_activity2) { create(:unit_activity, unit: unit2, activity: unit_activity1.activity) }
      let!(:activity_session1) { create(:activity_session, :finished, user: student1, classroom_unit: classroom_unit1, activity: unit_activity1.activity) }
      let!(:activity_session2) { create(:activity_session, :finished, user: student2, classroom_unit: classroom_unit1, activity: unit_activity1.activity) }
      let!(:activity_session3) { create(:activity_session, :finished, completed_at: activity_session2.completed_at.since(1.minute), user: student2, classroom_unit: classroom_unit2, activity: unit_activity1.activity) }

      it 'should set the variables for all the final score activity sessions for that activity, classroom, and unit, with only one per student' do
        set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(unit_activity1.activity_id, classroom.id, nil)
        expect(@assigned_students).to include(student1, student2, student3)
        expect(@activity_sessions).to include(activity_session3, activity_session1)
      end

      it 'should not include a student or their activity session if they are no longer in the assigned student ids array' do
        classroom_unit1.remove_assigned_student(student1.id)
        classroom_unit1.reload
        set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(unit_activity1.activity_id, classroom.id, nil)
        expect(@assigned_students).to include(student2, student3)
        expect(@activity_sessions).to include(activity_session3)
      end

      it 'should not include an activity session that is not associated with the current classroom' do
        [students_classroom1, students_classroom3].each(&:delete)
        set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(unit_activity1.activity_id, classroom.id, nil)
        expect(@assigned_students).to eq [student2]
        expect(@activity_sessions.map(&:user_id).uniq).to eq [student2.id]
      end
    end
  end

  describe '#summarize_student_proficiency_for_skill_per_activity' do
    it 'should return NO_PROFICIENCY if the correct skill number is 0' do
      expect(summarize_student_proficiency_for_skill_per_activity(1, 0)).to eq(DiagnosticReports::NO_PROFICIENCY)
    end

    it 'should return PROFICIENCY if the correct skill number equals the present skill number' do
      expect(summarize_student_proficiency_for_skill_per_activity(1, 1)).to eq(DiagnosticReports::PROFICIENCY)
    end

    it 'should return PARTIAL_PROFICIENCY if the correct skill number is between 0 and the present skill number' do
      expect(summarize_student_proficiency_for_skill_per_activity(2, 1)).to eq(DiagnosticReports::PARTIAL_PROFICIENCY)
    end
  end
end
