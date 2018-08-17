class NotifyOfCompletedActivity
  def initialize(activity_session)
    @activity_session = activity_session
  end

  def call
    notify if should_notify?
  end

  private

  attr_reader :activity_session, :user

  def notify
    activity_name = activity_session.activity.name
    user          = activity_session.user

    Notification.create(text: "#{activity_name} completed", user: user)
  end

  def should_notify?
    state_change = activity_session.previous_changes['state']
    state_change.present? && state_change.last == 'finished'
  end
end
