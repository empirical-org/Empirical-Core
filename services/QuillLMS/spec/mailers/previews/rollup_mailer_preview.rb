# frozen_string_literal: true

class RollupMailerPreview < ActionMailer::Preview
  def rollup
    teacher = User.find_or_initialize_by(
      name: 'Teacher MailerPreview',
      email: 'teacher@rollup_mailer_preview.com',
      role: 'teacher'
    )

    teacher_info = TeacherInfo.find_or_initialize_by(user: teacher)
    teacher_notification = TeacherNotifications::StudentCompletedDiagnostic.find_or_initialize_by(user: teacher).tap{|row| row.student_name = 'John' }
    TeacherNotifications::RollupMailer.rollup(teacher, [teacher_notification])
  end
  end
