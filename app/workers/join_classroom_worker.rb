class JoinClassroomWorker
  include Sidekiq::Worker
  include CheckboxCallback

  def perform(id)
    @user = User.find(id)
    # tell segment.io
    analytics = JoinClassroomAnalytics.new
    analytics.track(@user)
  end
end
