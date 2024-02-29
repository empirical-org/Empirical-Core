# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_sessions
#
#  id                    :integer          not null, primary key
#  completed_at          :datetime
#  data                  :jsonb
#  is_final_score        :boolean          default(FALSE)
#  is_retry              :boolean          default(FALSE)
#  percentage            :float
#  started_at            :datetime
#  state                 :string(255)      default("unstarted"), not null
#  temporary             :boolean          default(FALSE)
#  timespent             :integer
#  uid                   :string(255)
#  visible               :boolean          default(TRUE), not null
#  created_at            :datetime
#  updated_at            :datetime
#  activity_id           :integer
#  classroom_activity_id :integer
#  classroom_unit_id     :integer
#  pairing_id            :string(255)
#  user_id               :integer
#
# Indexes
#
#  new_activity_sessions_activity_id_idx        (activity_id)
#  new_activity_sessions_classroom_unit_id_idx  (classroom_unit_id)
#  new_activity_sessions_completed_at_idx       (completed_at)
#  new_activity_sessions_uid_idx                (uid) UNIQUE
#  new_activity_sessions_uid_key                (uid) UNIQUE
#  new_activity_sessions_user_id_idx            (user_id)
#
FactoryBot.define do
  factory :simple_activity_session, class: 'ActivitySession'

  # TODO: don't make all activity_sessions finished, used :finished trait
  factory :activity_session do
    activity            { create(:activity, :production) }
    uid                 { SecureRandom.urlsafe_base64 }
    percentage          { 0.50 }
    started_at          { created_at }
    state               { 'finished' }
    completed_at        { Time.current }
    is_final_score      { true }
    is_retry            { false }
    temporary           { false }
    visible             { true }

    before(:create) do |activity_session|
      if activity_session.user && !activity_session.classroom_unit
        activity_session.classroom_unit = create(:classroom_unit, assigned_student_ids: [activity_session.user.id])
      elsif activity_session.user && activity_session.classroom_unit && activity_session.classroom_unit.assigned_student_ids.empty?
        activity_session.classroom_unit.update(assigned_student_ids: [activity_session.user.id])
      elsif activity_session.classroom_unit && !activity_session.user
        student = create(:student)
        activity_session.user = student
        activity_session.classroom_unit.update(assigned_student_ids: [activity_session.user.id])
      elsif !activity_session.user && !activity_session.classroom_unit
        student = create(:student)
        activity_session.user = student
        activity_session.classroom_unit = create(:classroom_unit, assigned_student_ids: [student.id])
      end
    end

    after(:create) do |activity_session|
      classroom_unit = activity_session.classroom_unit
      UnitActivity.find_or_create_by(activity: activity_session.activity, unit_id: classroom_unit.unit_id)
      StudentsClassrooms.find_or_create_by(student_id: activity_session.user_id, classroom_id: classroom_unit.classroom_id )
      ConceptResult.find_or_create_by(activity_session: activity_session)
    end

    trait :retry do
      is_retry { true }
    end

    trait :unstarted do
      percentage { nil }
      state { 'unstarted' }
      completed_at { nil }
      is_final_score { false }
    end

    trait :started do
      percentage { nil }
      state { 'started' }
      completed_at { nil }
      is_final_score { false }
    end

    trait :finished do
      percentage {0.50}
      state { 'finished' }
      completed_at { Time.current }
      is_final_score { true }
    end

    factory :diagnostic_activity_session do
      activity { create(:diagnostic_activity) }
    end

    factory :evidence_activity_session do
      activity { create(:evidence_lms_activity) }
      # We explicitly don't record percentages for Evidence sessions
      percentage { nil }
    end

    factory :proofreader_activity_session do
      activity { create(:proofreader_activity) }
    end

    factory :grammar_activity_session do
      activity { create(:grammar_activity) }
    end

    factory :connect_activity_session do
      activity { create(:connect_activity) }
    end

    factory :lesson_activity_session do
      activity { create(:lesson_activity) }
    end

    factory :activity_session_without_concept_results do
      after(:create) do |activity_session|
        ConceptResult.where(activity_session: activity_session).destroy_all
      end
    end
  end
end
