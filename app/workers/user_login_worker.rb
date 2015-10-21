class UserLoginWorker
  include Sidekiq::Worker
  sidekiq_options :retry => 2


  def perform(id, ip_address)

    @user = User.find(id)

    @user.update_attributes(ip_address: ip_address)
    @user.save

    data = @user.serialized.as_json(root: false)

    data[:keen] = {
      addons: [{
          name: "keen:ip_to_geo",
          input: {ip: "ip_address"},
          output: "ip_geo_info"
        }]
    }

    KeenWrapper.publish(:login, data)

    analytics = SigninAnalytics.new
    if @user.role == 'teacher'
      analytics.track_teacher(@user)
    elsif @user.role == 'student'
      analytics.track_student(@user)
    end

  end
end
