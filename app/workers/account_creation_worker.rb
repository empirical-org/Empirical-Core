class AccountCreationWorker
  include Sidekiq::Worker

  def perform(id)

    @user = User.find(id)

    # send email, subscriptions
    # FIXME : had to comment out below because its sending out like 7 emails per new account
    # @user.send_welcome_email

    # tell keen
    KeenWrapper.publish(:accounts, {event: 'creation', role: @user.role, classcode: @user.classcode})

    # tell segment.io
    analytics = SegmentAnalytics.new
    if @user.role == 'teacher'
      analytics.track_teacher_creation(@user)
    end
  end
end
