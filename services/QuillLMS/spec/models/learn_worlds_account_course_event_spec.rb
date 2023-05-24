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
require 'rails_helper'

RSpec.describe LearnWorldsAccountCourseEvent, type: :model do
  subject { create(:learn_worlds_account_course_event) }

  it { should belong_to(:learn_worlds_account) }
  it { should belong_to(:learn_worlds_course) }

  it { should validate_presence_of(:event_type) }
  it { should validate_inclusion_of(:event_type).in_array(LearnWorldsAccountCourseEvent::EVENT_TYPES) }

  it { expect(subject).to be_valid }
end
