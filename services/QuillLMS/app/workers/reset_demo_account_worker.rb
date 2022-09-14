# frozen_string_literal: true

class ResetDemoAccountWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW
  STAFF_DEMO_EMAIL = "hello+demoteacher+staff@quill.org"

  def perform
    Demo::ReportDemoCreator.create_demo(nil)
    Demo::ReportDemoCreator.create_demo(STAFF_DEMO_EMAIL)
  end
end

