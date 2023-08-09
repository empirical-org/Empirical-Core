# frozen_string_literal: true

require 'rails_helper'

describe GrowthResultsSummary do
  include GrowthResultsSummary

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
  let!(:pre_test_activity_session) { create(:activity_session_without_concept_results, :finished, user: student1, classroom_unit: pre_test_classroom_unit, activity: pre_test_unit_activity.activity) }
  let!(:post_test_activity_session) { create(:activity_session_without_concept_results, :finished, user: student1, classroom_unit: post_test_classroom_unit, activity: post_test_unit_activity.activity) }
  let!(:post_test_activity_session_with_no_pre_test) { create(:activity_session_without_concept_results, :finished, user: student2, classroom_unit: post_test_classroom_unit, activity: post_test_unit_activity.activity) }

  let!(:diagnostic_question_skill1) { create(:diagnostic_question_skill, skill_group: pre_test_skill_group_activity.skill_group) }
  let!(:diagnostic_question_skill2) { create(:diagnostic_question_skill, skill_group: pre_test_skill_group_activity.skill_group) }
  let!(:diagnostic_question_skill3) { create(:diagnostic_question_skill, skill_group: pre_test_skill_group_activity.skill_group) }
  let!(:diagnostic_question_skill4) { create(:diagnostic_question_skill, skill_group: pre_test_skill_group_activity.skill_group) }

  let!(:correct_concept_result1) { create(:concept_result, activity_session: pre_test_activity_session, correct: true, question_number: 1, extra_metadata: { question_uid: diagnostic_question_skill1.question.uid } ) }
  let!(:correct_concept_result2) { create(:concept_result, activity_session: post_test_activity_session, correct: true, question_number: 1, extra_metadata: { question_uid: diagnostic_question_skill2.question.uid } ) }
  let!(:incorrect_concept_result1) { create(:concept_result, activity_session: pre_test_activity_session, correct: false, question_number: 2, extra_metadata: { question_uid: diagnostic_question_skill3.question.uid } ) }
  let!(:correct_concept_result3) { create(:concept_result, activity_session: post_test_activity_session, correct: true, question_number: 2, extra_metadata: { question_uid: diagnostic_question_skill4.question.uid } ) }

  describe '#growth_results_summary' do
    it 'should return data with the student results and skill group summaries' do
      expect(growth_results_summary(pre_test_unit_activity.activity_id, post_test_unit_activity.activity_id, classroom.id)).to eq({
        skill_group_summaries: [
          {
            name: pre_test_skill_group_activity.skill_group.name,
            description: pre_test_skill_group_activity.skill_group.description,
            not_yet_proficient_in_post_test_student_names: [],
            proficiency_scores_by_student: {
              student1.name => {
                pre: 0.5,
                post: 1.0
              }
            }
          }
        ],
        student_results: [
          {
            name: student1.name,
            id: student1.id,
            skill_groups: [
              {
                skill_group: pre_test_skill_group_activity.skill_group.name,
                description: pre_test_skill_group_activity.skill_group.description,
                skills: [
                  {
                    pre: {
                      id: diagnostic_question_skill1.id,
                      name: diagnostic_question_skill1.name,
                      number_correct: 1,
                      number_incorrect: 0,
                      proficiency_score: 1,
                      summary: GrowthResultsSummary::FULLY_CORRECT,
                    },
                    post: nil
                  },
                  {
                    post: {
                      id: diagnostic_question_skill2.id,
                      name: diagnostic_question_skill2.name,
                      number_correct: 1,
                      number_incorrect: 0,
                      proficiency_score: 1,
                      summary: GrowthResultsSummary::FULLY_CORRECT,
                    },
                    pre: nil
                  },
                  {
                    pre: {
                      id: diagnostic_question_skill3.id,
                      name: diagnostic_question_skill3.name,
                      number_correct: 0,
                      number_incorrect: 1,
                      proficiency_score: 0,
                      summary: GrowthResultsSummary::NOT_CORRECT,
                    },
                    post: nil
                  },
                  {
                    post: {
                      id: diagnostic_question_skill4.id,
                      name: diagnostic_question_skill4.name,
                      number_correct: 1,
                      number_incorrect: 0,
                      proficiency_score: 1,
                      summary: GrowthResultsSummary::FULLY_CORRECT,
                    },
                    pre: nil
                  }
                ],
                number_of_correct_questions_text: "2 of 2 questions correct",
                proficiency_text: GrowthResultsSummary::GAINED_PROFICIENCY,
                pre_test_proficiency: GrowthResultsSummary::PARTIAL_PROFICIENCY,
                pre_test_proficiency_score: 0.5,
                post_test_proficiency: GrowthResultsSummary::PROFICIENCY,
                post_test_proficiency_score: 1.0,
                id: pre_test_skill_group_activity.skill_group.id,
                post_correct_skill_ids: [diagnostic_question_skill2.id, diagnostic_question_skill4.id],
                pre_correct_skill_ids: [diagnostic_question_skill1.id],
                skill_ids: [diagnostic_question_skill2.id, diagnostic_question_skill4.id]
              }
            ],
            total_acquired_skill_groups_count: 1,
            total_correct_questions_count: 2,
            total_pre_correct_questions_count: 1,
            total_pre_possible_questions_count: 2,
            total_possible_questions_count: 2,
            correct_question_text: "2 of 2 questions correct",
            correct_skill_groups_text: "1 of 1 skill groups",
          },
          {
            name: student2.name
          }
        ]
      })
    end
  end

  describe '#student_results' do
    it 'should return an array with a hash for each student' do
      @skill_group_summaries = [
        {
          name: pre_test_skill_group_activity.skill_group.name,
          description: pre_test_skill_group_activity.skill_group.description,
          not_yet_proficient_in_post_test_student_names: [],
          proficiency_scores_by_student: {}
        }
      ]
      @skill_groups = [pre_test_skill_group_activity.skill_group]
      @pre_test_assigned_students = [student1, student2]
      @pre_test_activity_sessions = [pre_test_activity_session].map { |session| [session.user_id, session] }.to_h
      @post_test_assigned_students = [student1, student2]
      @post_test_activity_sessions = [post_test_activity_session].map { |session| [session.user_id, session] }.to_h
      expect(student_results).to eq(
        [
          {
            name: student1.name,
            id: student1.id,
            skill_groups: [
              {
                skill_group: pre_test_skill_group_activity.skill_group.name,
                description: pre_test_skill_group_activity.skill_group.description,
                skills: [
                  {
                    pre: {
                      id: diagnostic_question_skill1.id,
                      name: diagnostic_question_skill1.name,
                      number_correct: 1,
                      number_incorrect: 0,
                      proficiency_score: 1,
                      summary: GrowthResultsSummary::FULLY_CORRECT,
                    },
                    post: nil
                  },
                  {
                    post: {
                      id: diagnostic_question_skill2.id,
                      name: diagnostic_question_skill2.name,
                      number_correct: 1,
                      number_incorrect: 0,
                      proficiency_score: 1,
                      summary: GrowthResultsSummary::FULLY_CORRECT,
                    },
                    pre: nil
                  },
                  {
                    pre: {
                      id: diagnostic_question_skill3.id,
                      name: diagnostic_question_skill3.name,
                      number_correct: 0,
                      number_incorrect: 1,
                      proficiency_score: 0,
                      summary: GrowthResultsSummary::NOT_CORRECT,
                    },
                    post: nil
                  },
                  {
                    post: {
                      id: diagnostic_question_skill4.id,
                      name: diagnostic_question_skill4.name,
                      number_correct: 1,
                      number_incorrect: 0,
                      proficiency_score: 1,
                      summary: GrowthResultsSummary::FULLY_CORRECT,
                    },
                    pre: nil
                  }
                ],
                number_of_correct_questions_text: "2 of 2 questions correct",
                proficiency_text: GrowthResultsSummary::GAINED_PROFICIENCY,
                pre_test_proficiency: GrowthResultsSummary::PARTIAL_PROFICIENCY,
                pre_test_proficiency_score: 0.5,
                post_test_proficiency: GrowthResultsSummary::PROFICIENCY,
                post_test_proficiency_score: 1.0,
                id: pre_test_skill_group_activity.skill_group.id,
                post_correct_skill_ids: [diagnostic_question_skill2.id, diagnostic_question_skill4.id],
                pre_correct_skill_ids: [diagnostic_question_skill1.id],
                skill_ids: [diagnostic_question_skill2.id, diagnostic_question_skill4.id]
              }
            ],
            total_acquired_skill_groups_count: 1,
            total_correct_questions_count: 2,
            total_pre_correct_questions_count: 1,
            total_pre_possible_questions_count: 2,
            total_possible_questions_count: 2,
            correct_question_text: "2 of 2 questions correct",
            correct_skill_groups_text: "1 of 1 skill groups",
          },
          {
            name: student2.name
          }
        ]
      )
    end

    it 'should not include results if the student has completed a post test but not a pre test' do
      @skill_group_summaries = [
        {
          name: pre_test_skill_group_activity.skill_group.name,
          description: pre_test_skill_group_activity.skill_group.description,
          not_yet_proficient_in_post_test_student_names: [],
          proficiency_scores_by_student: {}
        }
      ]
      @skill_groups = [pre_test_skill_group_activity.skill_group]
      @pre_test_assigned_students = [student2]
      @pre_test_activity_sessions = []
      @post_test_assigned_students = [student2]
      @post_test_activity_sessions = [post_test_activity_session_with_no_pre_test].map { |session| [session.user_id, session] }.to_h
      expect(student_results).to eq(
        [
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
          name: pre_test_skill_group_activity.skill_group.name,
          description: pre_test_skill_group_activity.skill_group.description,
          not_yet_proficient_in_post_test_student_names: [],
          proficiency_scores_by_student: {}
        }
      ]
      expect(skill_groups_for_session([pre_test_skill_group_activity.skill_group], post_test_activity_session, pre_test_activity_session, student1.name)).to eq [
        {
          skill_group: pre_test_skill_group_activity.skill_group.name,
          description: pre_test_skill_group_activity.skill_group.description,
          skills: [
            {
              pre: {
                id: diagnostic_question_skill1.id,
                name: diagnostic_question_skill1.name,
                number_correct: 1,
                number_incorrect: 0,
                proficiency_score: 1,
                summary: GrowthResultsSummary::FULLY_CORRECT,
              },
              post: nil
            },
            {
              post: {
                id: diagnostic_question_skill2.id,
                name: diagnostic_question_skill2.name,
                number_correct: 1,
                number_incorrect: 0,
                proficiency_score: 1,
                summary: GrowthResultsSummary::FULLY_CORRECT,
              },
              pre: nil
            },
            {
              pre: {
                id: diagnostic_question_skill3.id,
                name: diagnostic_question_skill3.name,
                number_correct: 0,
                number_incorrect: 1,
                proficiency_score: 0,
                summary: GrowthResultsSummary::NOT_CORRECT,
              },
              post: nil
            },
            {
              post: {
                id: diagnostic_question_skill4.id,
                name: diagnostic_question_skill4.name,
                number_correct: 1,
                number_incorrect: 0,
                proficiency_score: 1,
                summary: GrowthResultsSummary::FULLY_CORRECT,
              },
              pre: nil
            }
          ],
          number_of_correct_questions_text: "2 of 2 questions correct",
          proficiency_text: GrowthResultsSummary::GAINED_PROFICIENCY,
          pre_test_proficiency: GrowthResultsSummary::PARTIAL_PROFICIENCY,
          pre_test_proficiency_score: 0.5,
          post_test_proficiency: GrowthResultsSummary::PROFICIENCY,
          post_test_proficiency_score: 1.0,
          id: pre_test_skill_group_activity.skill_group.id,
          post_correct_skill_ids: [diagnostic_question_skill2.id, diagnostic_question_skill4.id],
          pre_correct_skill_ids: [diagnostic_question_skill1.id],
          skill_ids: [diagnostic_question_skill2.id, diagnostic_question_skill4.id]
        }
      ]
    end

    it 'should add the students name to the not_yet_proficient_in_post_test_student_names array for any skill group they are not proficient in' do
      @skill_group_summaries = [
        {
          name: pre_test_skill_group_activity.skill_group.name,
          description: pre_test_skill_group_activity.skill_group.description,
          not_yet_proficient_in_post_test_student_names: [],
          proficiency_scores_by_student: {}
        }
      ]
      skill_groups_for_session([pre_test_skill_group_activity.skill_group], post_test_activity_session, pre_test_activity_session, student1.name)
      expect(@skill_group_summaries[0][:not_yet_proficient_in_post_test_student_names]).to eq []
    end

  end
end
