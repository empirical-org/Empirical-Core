class AccountCreationWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find(id)

    # tell segment.io
    analytics = AccountCreationAnalytics.new
    if @user.role == 'teacher'
      analytics.track_teacher(@user)
    elsif @user.role == 'student'
      analytics.track_student(@user)
    end
  end
end
