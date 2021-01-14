class UserLoginWorker
  include Sidekiq::Worker

  def perform(id, ip_address)

    @user = User.find_by(id: id)
    if @user
      @user.update(ip_address: ip_address, last_sign_in: Time.now)
      @user.save

      analytics = Analyzer.new
      if @user.role == 'teacher'
        analytics.track(@user, SegmentIo::BackgroundEvents::TEACHER_SIGNIN)
      elsif @user.role == 'student'
        # keep these in the following order so the student is the last one identified
        teacher = @user.teacher_of_student
        if teacher.present?
          analytics.track_with_attributes(
            teacher,
            SegmentIo::BackgroundEvents::TEACHERS_STUDENT_SIGNIN,
            properties: {
              student_id: @user.id
            }
          )
        end
      end

    end
  end
end
