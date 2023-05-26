# frozen_string_literal: true

# == Schema Information
#
# Table name: learn_worlds_accounts
#
#  id          :bigint           not null, primary key
#  last_login  :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  external_id :string           not null
#  user_id     :bigint
#
# Indexes
#
#  index_learn_worlds_accounts_on_external_id  (external_id) UNIQUE
#  index_learn_worlds_accounts_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class LearnWorldsAccount < ApplicationRecord
  belongs_to :user

  validates :external_id, presence: true, uniqueness: true

  has_many :learn_worlds_account_enrolled_course_events,
    -> { enrolled },
    class_name: 'LearnWorldsAccountCourseEvent',
    dependent: :destroy

  has_many :enrolled_courses,
    through: :learn_worlds_account_enrolled_course_events,
    source: :learn_worlds_course

  has_many :learn_worlds_account_completed_course_events,
    -> { completed },
    class_name: 'LearnWorldsAccountCourseEvent',
    dependent: :destroy

  has_many :completed_courses,
    through: :learn_worlds_account_completed_course_events,
    source: :learn_worlds_course

  has_many :learn_worlds_account_earned_certificate_course_events,
    -> { earned_certificate },
    class_name: 'LearnWorldsAccountCourseEvent',
    dependent: :destroy

  has_many :earned_certificate_courses,
    through: :learn_worlds_account_earned_certificate_course_events,
    source: :learn_worlds_course
end
