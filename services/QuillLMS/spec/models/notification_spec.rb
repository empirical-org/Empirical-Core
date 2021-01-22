# == Schema Information
#
# Table name: notifications
#
#  id         :integer          not null, primary key
#  meta       :jsonb            not null
#  text       :text             not null
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer          not null
#
# Indexes
#
#  index_notifications_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Notification do
  it { should validate_length_of(:text).is_at_most(500) }
  it { should validate_presence_of(:text) }
  it { should belong_to(:user) }
  it { should validate_presence_of(:user) }

  describe '#activity_student_report_path' do
    it 'returns the path saved in meta jsonb column' do
      path         = '/cool_resources/5'
      notification = create(:notification,
        meta: { activity_student_report_path: path }
      )

      expect(notification.activity_student_report_path).to eq(path)
    end
  end
end
