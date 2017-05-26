class UserLoginWorker
  include Sidekiq::Worker

  def perform(id, ip_address)

    @user = User.find(id)
    @user.update(ip_address: ip_address, last_sign_in: Time.now)
    @user.save

    analytics = SigninAnalytics.new
    if @user.role == 'teacher'
      analytics.track_teacher(@user)
    elsif @user.role == 'student'
      analytics.track_student(@user)
    end

  end
end
