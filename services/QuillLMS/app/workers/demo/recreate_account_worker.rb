# frozen_string_literal: true

# destroy demo account and recreates it from scratch
class Demo::RecreateAccountWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW, retry: false

  STAFF_DEMO_EMAIL = "hello+demoteacher+staff@quill.org"

  def perform
    Demo::ReportDemoCreator.create_demo(nil, teacher_demo: true)
    Demo::ReportDemoCreator.create_demo(STAFF_DEMO_EMAIL)
  end
end

