class AccountCreationWorker
  include Sidekiq::Worker

  def perform(id)

    @user = User.find(id)

    # send email, subscriptions
    @user.send_welcome_email

    # tell mixpanel
    $mixpanel.try(:track, @user.id, 'account created')
    $mixpanel.try(:track, @user.id, "#{@user.role} created")


    # tell keen
    KeenWrapper.publish(:accounts, {event: 'creation', role: @user.role, classcode: @user.classcode})

    # tell segment.io
    analytics = SegmentAnalytics.new
    if @user.role == 'teacher'
      analytics.track_teacher_creation(@user)
    end
  end
end
