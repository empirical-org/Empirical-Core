# frozen_string_literal: true

require 'rails_helper'

describe ResultsSummary do
  include ResultsSummary

  let!(:unit) { create(:unit) }
  let!(:classroom) { create(:classroom) }
  let!(:student1) { create(:student, name: 'Alphabetical A') }
  let!(:students_classroom1) { create(:students_classrooms, classroom: classroom, student: student1) }
  let!(:student2) { create(:student, name: 'Alphabetical B') }
  let!(:students_classroom2) { create(:students_classrooms, classroom: classroom, student: student2) }
  let!(:student3) { create(:student, name: 'Alphabetical C') }
  let!(:students_classroom3) { create(:students_classrooms, classroom: classroom, student: student3) }
  let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom, assigned_student_ids: [student1.id, student2.id, student3.id]) }
  let!(:unit_activity) { create(:unit_activity, unit: unit) }
  let!(:skill_group_activity) { create(:skill_group_activity, activity: unit_activity.activity) }
  let!(:activity_session1) { create(:activity_session_without_concept_results, :finished, user: student1, classroom_unit: classroom_unit, activity: unit_activity.activity) }
  let!(:activity_session2) { create(:activity_session_without_concept_results, :finished, user: student3, classroom_unit: classroom_unit, activity: unit_activity.activity) }
  let!(:diagnostic_question_skill1) { create(:diagnostic_question_skill, skill_group: skill_group_activity.skill_group) }
  let!(:diagnostic_question_skill2) { create(:diagnostic_question_skill, skill_group: skill_group_activity.skill_group) }
  let!(:correct_concept_result1) { create(:concept_result, activity_session: activity_session1, correct: true, question_number: 1, extra_metadata: { question_uid: diagnostic_question_skill1.question.uid }) }
  let!(:correct_concept_result2) { create(:concept_result, activity_session: activity_session2, correct: true, question_number: 1, extra_metadata: { question_uid: diagnostic_question_skill1.question.uid }) }
  let!(:incorrect_concept_result) { create(:concept_result, activity_session: activity_session1, correct: false, question_number: 2, extra_metadata: { question_uid: diagnostic_question_skill2.question.uid }) }

  describe '#results_summary' do
    it 'should return data with the student results and skill group summaries' do
      expect(results_summary(unit_activity.activity_id, classroom.id, nil)).to eq({
        activity_id: unit_activity.activity_id,
        classroom_id: classroom.id,
        unit_id: nil,
        skill_group_summaries: [
          {
            name: skill_group_activity.skill_group.name,
            description: skill_group_activity.skill_group.description,
            not_yet_proficient_student_names: [student1.name],
            proficiency_scores_by_student: {
              student1.name => 0.5,
              student3.name => 1.0
            },
            question_uids: skill_group_activity.skill_group.questions.pluck(:uid),
          }
        ],
        student_results: [
          {
            name: student1.name,
            id: student1.id,
            skill_groups: [
              {
                skill_group: skill_group_activity.skill_group.name,
                description: skill_group_activity.skill_group.description,
                skills: [
                  {
                    id: diagnostic_question_skill1.id,
                    name: diagnostic_question_skill1.name,
                    number_correct: 1,
                    number_incorrect: 0,
                    proficiency_score: 1,
                    summary: ResultsSummary::FULLY_CORRECT,
                    question_uid: diagnostic_question_skill1.question.uid
                  },
                  {
                    id: diagnostic_question_skill2.id,
                    name: diagnostic_question_skill2.name,
                    number_correct: 0,
                    number_incorrect: 1,
                    proficiency_score: 0,
                    summary: ResultsSummary::NOT_CORRECT,
                    question_uid: diagnostic_question_skill2.question.uid
                  }
                ],
                question_uids: skill_group_activity.skill_group.questions.pluck(:uid),
                skill_ids: [diagnostic_question_skill1.id, diagnostic_question_skill2.id],
                correct_skill_ids: [diagnostic_question_skill1.id],
                number_of_correct_questions_text: '1 of 2 Questions Correct',
                proficiency_text: ResultsSummary::PARTIAL_PROFICIENCY,
                id: skill_group_activity.skill_group.id,
                number_correct: 1,
                number_incorrect: 1,
                summary: ResultsSummary::PARTIALLY_CORRECT,
              }
            ],
            total_correct_questions_count: 1,
            total_correct_skill_groups_count: 0,
            total_possible_questions_count: 2,
            correct_question_text: '1 of 2 Questions Correct',
            correct_skill_groups_text: '0 of 1 Skills',
          },
          {
            name: student2.name
          },
          {
            name: student3.name,
            id: student3.id,
            skill_groups: [
              {
                skill_group: skill_group_activity.skill_group.name,
                description: skill_group_activity.skill_group.description,
                skills: [
                  {
                    id: diagnostic_question_skill1.id,
                    name: diagnostic_question_skill1.name,
                    number_correct: 1,
                    number_incorrect: 0,
                    proficiency_score: 1.0,
                    summary: ResultsSummary::FULLY_CORRECT,
                    question_uid: diagnostic_question_skill1.question.uid
                  }
                ],
                question_uids: skill_group_activity.skill_group.questions.pluck(:uid),
                skill_ids: [diagnostic_question_skill1.id],
                correct_skill_ids: [diagnostic_question_skill1.id],
                number_of_correct_questions_text: '1 of 1 Questions Correct',
                proficiency_text: ResultsSummary::PROFICIENCY,
                id: skill_group_activity.skill_group.id,
                number_correct: 1,
                number_incorrect: 0,
                summary: ResultsSummary::FULLY_CORRECT,
              }
            ],
            total_correct_questions_count: 1,
            total_correct_skill_groups_count: 1,
            total_possible_questions_count: 1,
            correct_question_text: '1 of 1 Questions Correct',
            correct_skill_groups_text: '1 of 1 Skills',
          }
        ]
      })
    end
  end

  describe '#student_results' do
    it 'should return an array with a hash for each student' do
      @skill_group_summaries = [
        {
          name: skill_group_activity.skill_group.name,
          description: skill_group_activity.skill_group.description,
          not_yet_proficient_student_names: [],
          proficiency_scores_by_student: {}
        }
      ]
      @skill_groups = [skill_group_activity.skill_group]
      @assigned_students = [student1, student2]
      @activity_sessions = [activity_session1].to_h { |session| [session.user_id, session] }

      expect(student_results).to eq(
        [
          {
            name: student1.name,
            id: student1.id,
            skill_groups: [
              {
                skill_group: skill_group_activity.skill_group.name,
                description: skill_group_activity.skill_group.description,
                skills: [
                  {
                    id: diagnostic_question_skill1.id,
                    name: diagnostic_question_skill1.name,
                    number_correct: 1,
                    number_incorrect: 0,
                    proficiency_score: 1,
                    summary: ResultsSummary::FULLY_CORRECT,
                    question_uid: diagnostic_question_skill1.question.uid,
                  },
                  {
                    id: diagnostic_question_skill2.id,
                    name: diagnostic_question_skill2.name,
                    number_correct: 0,
                    number_incorrect: 1,
                    proficiency_score: 0,
                    summary: ResultsSummary::NOT_CORRECT,
                    question_uid: diagnostic_question_skill2.question.uid,
                  }
                ],
                skill_ids: [diagnostic_question_skill1.id, diagnostic_question_skill2.id],
                correct_skill_ids: [diagnostic_question_skill1.id],
                number_correct: 1,
                number_incorrect: 1,
                number_of_correct_questions_text: '1 of 2 Questions Correct',
                proficiency_text: ResultsSummary::PARTIAL_PROFICIENCY,
                question_uids: skill_group_activity.skill_group.questions.pluck(:uid),
                id: skill_group_activity.skill_group.id,
                summary: ResultsSummary::PARTIALLY_CORRECT,
              }
            ],
            total_correct_questions_count: 1,
            total_correct_skill_groups_count: 0,
            total_possible_questions_count: 2,
            correct_question_text: '1 of 2 Questions Correct',
            correct_skill_groups_text: '0 of 1 Skills',
          },
          {
            name: student2.name
          }
        ]
      )
    end
  end

  describe '#skill_groups_for_session' do
    it 'should return an array with a hash for each skill group' do
      @skill_group_summaries = [
        {
          name: skill_group_activity.skill_group.name,
          description: skill_group_activity.skill_group.description,
          not_yet_proficient_student_names: [],
          proficiency_scores_by_student: {}
        }
      ]
      expect(skill_groups_for_session([skill_group_activity.skill_group], activity_session1.concept_results, student1.name)).to eq [
        {
          skill_group: skill_group_activity.skill_group.name,
          description: skill_group_activity.skill_group.description,
          skills: [
            {
              id: diagnostic_question_skill1.id,
              name: diagnostic_question_skill1.name,
              number_correct: 1,
              number_incorrect: 0,
              proficiency_score: 1,
              summary: ResultsSummary::FULLY_CORRECT,
              question_uid: diagnostic_question_skill1.question.uid,
            },
            {
              id: diagnostic_question_skill2.id,
              name: diagnostic_question_skill2.name,
              number_correct: 0,
              number_incorrect: 1,
              proficiency_score: 0,
              summary: ResultsSummary::NOT_CORRECT,
              question_uid: diagnostic_question_skill2.question.uid,
            }
          ],
          skill_ids: [diagnostic_question_skill1.id, diagnostic_question_skill2.id],
          correct_skill_ids: [diagnostic_question_skill1.id],
          number_correct: 1,
          number_incorrect: 1,
          number_of_correct_questions_text: '1 of 2 Questions Correct',
          proficiency_text: ResultsSummary::PARTIAL_PROFICIENCY,
          id: skill_group_activity.skill_group.id,
          question_uids: skill_group_activity.skill_group.questions.pluck(:uid),
          summary: ResultsSummary::PARTIALLY_CORRECT
        }
      ]
    end

    it 'should add the students name to the not_yet_proficient_student_names array for any skill group they are not proficient in' do
      @skill_group_summaries = [
        {
          name: skill_group_activity.skill_group.name,
          description: skill_group_activity.skill_group.description,
          not_yet_proficient_student_names: [],
          proficiency_scores_by_student: {}
        }
      ]
      skill_groups_for_session([skill_group_activity.skill_group], activity_session1.concept_results, student1.name)
      expect(@skill_group_summaries[0][:not_yet_proficient_student_names]).to eq [student1.name]
    end
  end
end
