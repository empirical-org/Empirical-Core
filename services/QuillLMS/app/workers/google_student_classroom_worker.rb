# frozen_string_literal: true

class GoogleStudentClassroomWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(student_id)
    begin
      student = User.find(student_id)
      GoogleIntegration::Classroom::Main.join_existing_google_classrooms(student)
    rescue StandardError => e
      NewRelic::Agent.notice_error(e, context: "Auth::GoogleController")
    end
  end
end
