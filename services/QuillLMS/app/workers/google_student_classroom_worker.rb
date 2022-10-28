# frozen_string_literal: true

class GoogleStudentClassroomWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(student_id)
    student = User.find(student_id)
    return unless student.google_authorized?

    GoogleIntegration::Classroom::Main.join_existing_google_classrooms(student)
  rescue => e
    ErrorNotifier.report(e, context: "Auth::GoogleController")
  end
end
