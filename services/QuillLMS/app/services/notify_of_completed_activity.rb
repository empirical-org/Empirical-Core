class NotifyOfCompletedActivity
  def initialize(activity_session, user)
    @activity_session = activity_session
  end

  def call
    activity_name = activity_session.activity.name

    Notification.create(text: "#{activity_name} completed!")
  end

  private

  attr_reader :activity_session
end
