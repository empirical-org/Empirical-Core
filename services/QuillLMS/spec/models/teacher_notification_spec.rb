# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_notifications
#
#  id            :bigint           not null, primary key
#  email_sent    :datetime
#  message_attrs :jsonb
#  type          :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint           not null
#
# Indexes
#
#  index_teacher_notifications_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'spec_helper'

RSpec.describe TeacherNotification, type: :model do
  context 'should relations' do
    it { should belong_to(:user) }
  end
end
