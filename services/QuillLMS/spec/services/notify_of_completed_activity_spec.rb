require 'rails_helper'

RSpec.describe NotifyOfCompletedActivity do
  it 'creates a completed activity notification if state changed to finished' do
    activity = create(:connect_activity, name: 'Cool Activity')
    user = create(:simple_user, role: 'student')
    activity_session = create(:simple_activity_session,
      activity: activity,
      state: 'started',
      user: user,
    )

    activity_session.update(state: 'finished')
    notifier = NotifyOfCompletedActivity.new(activity_session)

    expect { notifier.call }.to change(Notification, :count).by(1)
  end

  it 'saves a message on the notification' do
    activity = create(:connect_activity, name: 'Cool Activity')
    user = create(:simple_user, role: 'student')
    activity_session = create(:simple_activity_session,
      activity: activity,
      state: 'started',
      user: user,
    )

    activity_session.update(state: 'finished')
    notification = NotifyOfCompletedActivity.new(activity_session).call

    expect(notification.text).to eq('Cool Activity completed')
  end

  it 'does not notify if state has not changed to finish' do
    activity = create(:connect_activity, name: 'Cool Activity')
    user = create(:simple_user, role: 'student')
    activity_session = create(:simple_activity_session,
      activity: activity,
      state: 'started',
      user: user,
    )

    notification = NotifyOfCompletedActivity.new(activity_session).call

    expect(notification).to be nil
  end
end
