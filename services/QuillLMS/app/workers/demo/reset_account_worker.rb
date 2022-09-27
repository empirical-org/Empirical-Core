# frozen_string_literal: true

# Keeps Demo Account, but attempts to rollback user changes
class Demo::ResetAccountWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(teacher_id)
    teacher = User.find_by(id: teacher_id, role: User::TEACHER)

    return unless teacher

    Demo::ReportDemoCreator.reset_account(teacher)
  end
end
