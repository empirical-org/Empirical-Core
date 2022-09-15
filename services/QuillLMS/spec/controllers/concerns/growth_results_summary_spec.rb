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
  let!(:pre_test_activity_session) { create(:activity_session, :finished, user: student1, classroom_unit: pre_test_classroom_unit, activity: pre_test_unit_activity.activity) }
  let!(:post_test_activity_session) { create(:activity_session, :finished, user: student1, classroom_unit: post_test_classroom_unit, activity: post_test_unit_activity.activity) }
  let!(:post_test_activity_session_with_no_pre_test) { create(:activity_session, :finished, user: student2, classroom_unit: post_test_classroom_unit, activity: post_test_unit_activity.activity) }
  let!(:concept) { create(:concept) }
  let!(:skill) { create(:skill, skill_group: pre_test_skill_group_activity.skill_group) }
  let!(:skill_concept) { create(:skill_concept, concept: concept, skill: skill) }
  let!(:pre_test_correct_concept_result) { create(:concept_result, concept: concept, activity_session: pre_test_activity_session, correct: true) }
  let!(:post_test_correct_concept_result) { create(:concept_result, concept: concept, activity_session: post_test_activity_session, correct: true) }
  let!(:pre_test_incorrect_concept_result) { create(:concept_result, concept: concept, activity_session: pre_test_activity_session, correct: false) }

  describe '#growth_results_summary' do
    it 'should return data with the student results and skill group summaries' do
      expect(growth_results_summary(pre_test_unit_activity.activity_id, post_test_unit_activity.activity_id, classroom.id)).to eq({
        skill_group_summaries: [
          {
            name: pre_test_skill_group_activity.skill_group.name,
            description: pre_test_skill_group_activity.skill_group.description,
            not_yet_proficient_in_pre_test_student_names: [student1.name],
            not_yet_proficient_in_post_test_student_names: []
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
                      id: skill.id,
                      skill: skill.name,
                      number_correct: 1,
                      number_incorrect: 1,
                      summary: GrowthResultsSummary::PARTIALLY_CORRECT,
                    },
                    post: {
                      id: skill.id,
                      skill: skill.name,
                      number_correct: 1,
                      number_incorrect: 0,
                      summary: GrowthResultsSummary::FULLY_CORRECT,
                    }
                  }
                ],
                number_of_correct_skills_text: "1 of 1 skills correct",
                proficiency_text: GrowthResultsSummary::GAINED_PROFICIENCY,
                pre_test_proficiency: GrowthResultsSummary::NO_PROFICIENCY,
                post_test_proficiency: GrowthResultsSummary::PROFICIENCY,
                id: pre_test_skill_group_activity.skill_group.id,
                post_correct_skill_ids: [skill.id],
                pre_correct_skill_ids: [],
                acquired_skill_ids: [skill.id],
                skill_ids: [skill.id]
              }
            ],
            total_acquired_skills_count: 1,
            total_correct_skills_count: 1,
            total_pre_correct_skills_count: 0,
            total_possible_skills_count: 1,
            correct_skill_text: "1 of 1 skills correct"
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
          not_yet_proficient_in_pre_test_student_names: [],
          not_yet_proficient_in_post_test_student_names: [],
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
                      id: skill.id,
                      skill: skill.name,
                      number_correct: 1,
                      number_incorrect: 1,
                      summary: GrowthResultsSummary::PARTIALLY_CORRECT,
                    },
                    post: {
                      id: skill.id,
                      skill: skill.name,
                      number_correct: 1,
                      number_incorrect: 0,
                      summary: GrowthResultsSummary::FULLY_CORRECT,
                    }
                  }
                ],
                number_of_correct_skills_text: "1 of 1 skills correct",
                proficiency_text: GrowthResultsSummary::GAINED_PROFICIENCY,
                pre_test_proficiency: GrowthResultsSummary::NO_PROFICIENCY,
                post_test_proficiency: GrowthResultsSummary::PROFICIENCY,
                id: pre_test_skill_group_activity.skill_group.id,
                post_correct_skill_ids: [skill.id],
                pre_correct_skill_ids: [],
                acquired_skill_ids: [skill.id],
                skill_ids: [skill.id]
              }
            ],
            total_acquired_skills_count: 1,
            total_correct_skills_count: 1,
            total_pre_correct_skills_count: 0,
            total_possible_skills_count: 1,
            correct_skill_text: "1 of 1 skills correct"
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
          not_yet_proficient_in_pre_test_student_names: [],
          not_yet_proficient_in_post_test_student_names: [],
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
          not_yet_proficient_in_pre_test_student_names: [],
          not_yet_proficient_in_post_test_student_names: [],
        }
      ]
      expect(skill_groups_for_session([pre_test_skill_group_activity.skill_group], post_test_activity_session, pre_test_activity_session, student1.name)).to eq [
        {
          skill_group: pre_test_skill_group_activity.skill_group.name,
          description: pre_test_skill_group_activity.skill_group.description,
          skills: [
            {
              pre: {
                id: skill.id,
                skill: skill.name,
                number_correct: 1,
                number_incorrect: 1,
                summary: GrowthResultsSummary::PARTIALLY_CORRECT,
              },
              post: {
                id: skill.id,
                skill: skill.name,
                number_correct: 1,
                number_incorrect: 0,
                summary: GrowthResultsSummary::FULLY_CORRECT,
              }
            }
          ],
          number_of_correct_skills_text: "1 of 1 skills correct",
          proficiency_text: GrowthResultsSummary::GAINED_PROFICIENCY,
          pre_test_proficiency: GrowthResultsSummary::NO_PROFICIENCY,
          post_test_proficiency: GrowthResultsSummary::PROFICIENCY,
          id: pre_test_skill_group_activity.skill_group.id,
          post_correct_skill_ids: [skill.id],
          pre_correct_skill_ids: [],
          acquired_skill_ids: [skill.id],
          skill_ids: [skill.id]
        }
      ]
    end

    it 'should add the students name to the not_yet_proficient arrays for any skill group they are not proficient in' do
      @skill_group_summaries = [
        {
          name: pre_test_skill_group_activity.skill_group.name,
          description: pre_test_skill_group_activity.skill_group.description,
          not_yet_proficient_in_pre_test_student_names: [],
          not_yet_proficient_in_post_test_student_names: [],
        }
      ]
      skill_groups_for_session([pre_test_skill_group_activity.skill_group], post_test_activity_session, pre_test_activity_session, student1.name)
      expect(@skill_group_summaries[0][:not_yet_proficient_in_pre_test_student_names]).to eq [student1.name]
      expect(@skill_group_summaries[0][:not_yet_proficient_in_post_test_student_names]).to eq []
    end

  end
end
