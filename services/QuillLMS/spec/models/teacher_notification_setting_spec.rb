# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_notification_settings
#
#  id                :bigint           not null, primary key
#  notification_type :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint           not null
#
# Indexes
#
#  index_teacher_notification_settings_on_user_id           (user_id)
#  index_teacher_notification_settings_on_user_id_and_type  (user_id,notification_type) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe TeacherNotificationSetting, type: :model do
  context 'should relations' do
    it { should belong_to(:user) }
  end

  context 'should validations' do
    it { should validate_presence_of(:notification_type) }

    it { should validate_inclusion_of(:notification_type).in_array(TeacherNotificationSetting.notification_types).with_message(/is not a valid TeacherNotification type/) }
  end
end
