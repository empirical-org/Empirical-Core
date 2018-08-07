class UserLoginWorker
  include Sidekiq::Worker

  def perform(id, ip_address)

    @user = User.find(id)
    @user.update(ip_address: ip_address, last_sign_in: Time.now)
    @user.save

    analytics = Analyzer.new
    if @user.role == 'teacher'
      analytics.track(@user, SegmentIo::Events::TEACHER_SIGNIN)
    elsif @user.role == 'student'
      # keep these in the following order so the student is the last one identified
      teacher = @user.teacher_of_student
      analytics.track(
        teacher,
        SegmentIo::Events::TEACHERS_STUDENT_SIGNIN,
      ) unless teacher.nil?
      analytics.track_with_attributes(
        @user,
        SegmentIo::Events::STUDENT_SIGNIN,
        {
          context: { :ip => @user.ip_address },
          integrations: { all: true, Intercom: false }
        }
      )
    end

  end
end
