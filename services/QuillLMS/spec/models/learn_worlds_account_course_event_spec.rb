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
require 'rails_helper'

RSpec.describe LearnWorldsAccountCourseEvent, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
