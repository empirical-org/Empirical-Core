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
class LearnWorldsAccountCourseEvent < ApplicationRecord
  EVENT_TYPES = [
    ENROLLED = 'enrolled',
    COMPLETED = 'completed',
    EARNED_CERTIFICATE = 'earned_certificate'
  ]

  belongs_to :learn_worlds_account
  belongs_to :learn_worlds_course

  validates :event_type, inclusion: { in: EVENT_TYPES}
  validates :learn_worlds_account_id, presence: true
  validates :learn_worlds_course_id, presence: true

  scope :enrolled, -> { where(event_type: ENROLLED) }
  scope :completed, -> { where(event_type: COMPLETED) }
  scope :earned_certificate, -> { where(event_type: EARNED_CERTIFICATE) }
end
