# frozen_string_literal: true

class UserLoginWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find_by(id: id)
    return unless @user

    analytics = Analyzer.new
    case @user.role
    when 'teacher'
      TeacherActivityFeedRefillWorker.perform_async(@user.id)
      analytics.track(@user, SegmentIo::BackgroundEvents::TEACHER_SIGNIN)
    when 'student'
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
