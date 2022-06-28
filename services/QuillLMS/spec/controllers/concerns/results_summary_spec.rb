# frozen_string_literal: true

require 'rails_helper'

describe ResultsSummary do
  include ResultsSummary

  let!(:unit) { create(:unit) }
  let!(:classroom) { create(:classroom) }
  let!(:student1) { create(:student, name: 'Alphabetical A')}
  let!(:students_classroom1) { create(:students_classrooms, classroom: classroom, student: student1)}
  let!(:student2) { create(:student, name: 'Alphabetical B')}
  let!(:students_classroom2) { create(:students_classrooms, classroom: classroom, student: student2)}
  let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom, assigned_student_ids: [student1.id, student2.id]) }
  let!(:unit_activity) { create(:unit_activity, unit: unit) }
  let!(:skill_group_activity) { create(:skill_group_activity, activity: unit_activity.activity)}
  let!(:activity_session) { create(:activity_session, :finished, user: student1, classroom_unit: classroom_unit, activity: unit_activity.activity) }
  let!(:concept) { create(:concept) }
  let!(:skill) { create(:skill, skill_group: skill_group_activity.skill_group) }
  let!(:skill_concept) { create(:skill_concept, concept: concept, skill: skill) }
  let!(:correct_concept_result) { create(:old_concept_result_with_correct_answer, concept: concept, activity_session: activity_session) }
  let!(:incorrect_concept_result) { create(:old_concept_result_with_incorrect_answer, concept: concept, activity_session: activity_session) }

  describe '#results_summary' do
    it 'should return data with the student results and skill group summaries' do
      expect(results_summary(unit_activity.activity_id, classroom.id, nil)).to eq({
        skill_group_summaries: [
          {
            name: skill_group_activity.skill_group.name,
            description: skill_group_activity.skill_group.description,
            not_yet_proficient_student_names: [student1.name]
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
                    id: skill.id,
                    skill: skill.name,
                    number_correct: 1,
                    number_incorrect: 1,
                    summary: ResultsSummary::PARTIALLY_CORRECT,
                  }
                ],
                skill_ids: [skill.id],
                correct_skill_ids: [],
                number_of_correct_skills_text: "0 of 1 skills correct",
                proficiency_text: ResultsSummary::NO_PROFICIENCY,
                id: skill_group_activity.skill_group.id
              }
            ],
            total_correct_skills_count: 0,
            total_possible_skills_count: 1,
            correct_skill_text: "0 of 1 skills correct"
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
          name: skill_group_activity.skill_group.name,
          description: skill_group_activity.skill_group.description,
          not_yet_proficient_student_names: []
        }
      ]
      @skill_groups = [skill_group_activity.skill_group]
      @assigned_students = [student1, student2]
      @activity_sessions = [activity_session].map { |session| [session.user_id, session] }.to_h
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
                    id: skill.id,
                    skill: skill.name,
                    number_correct: 1,
                    number_incorrect: 1,
                    summary: ResultsSummary::PARTIALLY_CORRECT,
                  }
                ],
                skill_ids: [skill.id],
                correct_skill_ids: [],
                number_of_correct_skills_text: "0 of 1 skills correct",
                proficiency_text: ResultsSummary::NO_PROFICIENCY,
                id: skill_group_activity.skill_group.id
              }
            ],
            total_correct_skills_count: 0,
            total_possible_skills_count: 1,
            correct_skill_text: "0 of 1 skills correct"
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
          not_yet_proficient_student_names: []
        }
      ]
      expect(skill_groups_for_session([skill_group_activity.skill_group], activity_session, student1.name)).to eq [
        {
          skill_group: skill_group_activity.skill_group.name,
          description: skill_group_activity.skill_group.description,
          skills: [
            {
              id: skill.id,
              skill: skill.name,
              number_correct: 1,
              number_incorrect: 1,
              summary: ResultsSummary::PARTIALLY_CORRECT,
            }
          ],
          skill_ids: [skill.id],
          correct_skill_ids: [],
          number_of_correct_skills_text: "0 of 1 skills correct",
          proficiency_text: ResultsSummary::NO_PROFICIENCY,
          id: skill_group_activity.skill_group.id
        }
      ]
    end

    it 'should add the students name to the not_yet_proficient_student_names array for any skill group they are not proficient in' do
      @skill_group_summaries = [
        {
          name: skill_group_activity.skill_group.name,
          description: skill_group_activity.skill_group.description,
          not_yet_proficient_student_names: []
        }
      ]
      skill_groups_for_session([skill_group_activity.skill_group], activity_session, student1.name)
      expect(@skill_group_summaries[0][:not_yet_proficient_student_names]).to eq [student1.name]
    end

  end
end
