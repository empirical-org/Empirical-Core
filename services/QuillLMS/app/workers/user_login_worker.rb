# frozen_string_literal: true

class UserLoginWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find_by(id: id)
    return unless @user

    analytics = Analyzer.new
    case @user.role
    when User::TEACHER, User::ADMIN
      TeacherActivityFeedRefillWorker.perform_async(@user.id)
      analytics.track_with_attributes(
        @user,
        Analytics::SegmentIo::BackgroundEvents::TEACHER_SIGNIN,
        properties: @user&.segment_user&.common_params
      )
      record_user_login
    when User::STUDENT
      # keep these in the following order so the student is the last one identified
      teacher = @user.teacher_of_student
      if teacher.present?
        analytics.track_with_attributes(
          teacher,
          Analytics::SegmentIo::BackgroundEvents::TEACHERS_STUDENT_SIGNIN,
          properties: {
            student_id: @user.id
          }
        )
      end
    end
  end

  def record_user_login
    @user.record_login
  end
end
