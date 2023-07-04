class RollupPreview < ActionMailer::Preview
  def welcome
    @user = User.where(role: 'teacher').first
    @notifications = [TeacherNotification.last]
    TeacherNotifications::RollupMailer.rollup(@user, @notifications)
  end
end
