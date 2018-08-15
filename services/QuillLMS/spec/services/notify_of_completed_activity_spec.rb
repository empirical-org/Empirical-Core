require 'rails_helper'

RSpec.describe NotifyOfCompletedActivity do
  it 'creates a completed activity notification' do
    activity = create(:connect_activity, name: 'Cool Activity')
    activity_session = create(:simple_activity_session, activity: activity)
    user = create(:simple_user, role: 'student')

    notifier = NotifyOfCompletedActivity.new(activity_session, user)

    expect { notifier.call }.to change(Notification, :count).by(1)
  end

  it 'saves a message on the notification' do
    activity = create(:connect_activity, name: 'Cool Activity')
    activity_session = create(:simple_activity_session, activity: activity)
    user = create(:simple_user, role: 'student')

    notification = NotifyOfCompletedActivity.new(activity_session, user).call

    expect(notification.text).to eq('Cool Activity completed!')
  end
end
