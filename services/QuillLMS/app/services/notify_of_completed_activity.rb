class NotifyOfCompletedActivity
  include ApplicationHelper

  def initialize(activity_session)
    @activity_session = activity_session
  end

  def call
    return false unless should_notify?

    handle_invalid_notification { notify_all! }
  end

  private

  attr_reader :activity_session

  def notify_all!
    notify_student!
    notify_teachers!
  end

  def notify_student!
    Notification.create!(text: "#{activity.name} completed", user: student)
  end

  def notify_teachers!
    teachers    = activity_session.teachers
    report_path = activity_student_report_path(activity_session)

    teachers.each do |teacher|
      Notification.create!(
        text: "#{student.name} completed #{activity.name}",
        meta: { href: report_path },
        user: teacher
      )
    end
  end

  def student
    @student ||= activity_session.user
  end

  def activity
    @activity ||= activity_session.activity
  end

  def should_notify?
    state_change = activity_session.previous_changes['state']
    state_change.present? && state_change.last == 'finished'
  end

  def handle_invalid_notification(&block)
    begin
      ActiveRecord::Base.transaction { block.call }

      true
    rescue ActiveRecord::RecordInvalid => e
      false
    end
  end
end
