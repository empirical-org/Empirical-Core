# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_notifications
#
#  id                :bigint           not null, primary key
#  email_sent        :datetime
#  message_attrs     :jsonb
#  notification_type :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint           not null
#
# Indexes
#
#  index_teacher_notifications_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe TeacherNotification, type: :model do
  context 'should relations' do
    it { should belong_to(:user) }
  end

  context 'should validations' do
    it { should validate_presence_of(:notification_type) }

    it { should validate_inclusion_of(:notification_type).in_array(TeacherNotification::NOTIFICATION_TYPES) }
  end

  context 'message_attrs validation' do
    let(:teacher_notification) { build(:teacher_notification) }
    let(:valid_message_attrs) {
      {
        student_name: 'Student Name',
        classroom_name: 'Classroom Name'
      }
    }

    it 'should require message_attrs to be a hash' do
      teacher_notification.message_attrs = ''

      expect(teacher_notification).not_to be_valid
    end

    it 'should be invalid if some required keys are not in message_attrs' do
      teacher_notification.message_attrs = {}

      expect(teacher_notification).not_to be_valid
    end

    it 'should be valid if all required keys are in message_attrs' do
      teacher_notification.message_attrs = valid_message_attrs

      expect(teacher_notification).to be_valid
    end

    it 'should be invalid if message_attrs has keys not in the required list' do
      teacher_notification.message_attrs[:non_validated_key] = 'some value'

      expect(teacher_notification).not_to be_valid
    end
  end
end
