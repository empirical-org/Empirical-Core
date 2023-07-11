class RollupMailerPreview < ActionMailer::Preview

  def welcome_email
    @user = User.where(role: 'teacher').first
    @notifications = TeacherNotification.all
    TeacherNotifications::RollupMailer.rollup(@user, @notifications)
  end

end
