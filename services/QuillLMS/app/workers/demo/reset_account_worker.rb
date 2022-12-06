# frozen_string_literal: true

# Keeps Demo Account, but attempts to rollback user changes
class Demo::ResetAccountWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL, retry: false

  def perform(teacher_id)
    return if teacher_id.nil?

    Demo::ReportDemoCreator.reset_account(teacher_id)
  end
end
