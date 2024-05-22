# frozen_string_literal: true

# == Schema Information
#
# Table name: learn_worlds_account_course_events
#
#  id                      :bigint           not null, primary key
#  event_type              :string           not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  learn_worlds_account_id :bigint           not null
#  learn_worlds_course_id  :bigint           not null
#
# Indexes
#
#  learn_worlds_account_course_events_on_account_id  (learn_worlds_account_id)
#  learn_worlds_account_course_events_on_course_id   (learn_worlds_course_id)
#
# Foreign Keys
#
#  fk_rails_...  (learn_worlds_account_id => learn_worlds_accounts.id)
#  fk_rails_...  (learn_worlds_course_id => learn_worlds_courses.id)
#
FactoryBot.define do
  factory :learn_worlds_account_course_event, aliases: [:learn_worlds_account_enrolled_course_event] do
    learn_worlds_account
    learn_worlds_course
    event_type { LearnWorldsAccountCourseEvent::ENROLLED }

    factory :learn_worlds_account_completed_course_event do
      event_type { LearnWorldsAccountCourseEvent::COMPLETED }
    end

    factory :learn_worlds_account_earned_certificate_course_event do
      event_type { LearnWorldsAccountCourseEvent::EARNED_CERTIFICATE }
    end
  end
end
