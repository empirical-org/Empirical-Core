# frozen_string_literal: true

class ResetDemoAccountWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW
  STAFF_DEMO_NAME = "demoteacher+staff"

  def perform
    # sending nil destroys the default /demo account
    Demo::ReportDemoDestroyer.destroy_demo(nil)
    Demo::ReportDemoCreator.create_demo(nil)

    Demo::ReportDemoDestroyer.destroy_demo(STAFF_DEMO_NAME)
    Demo::ReportDemoCreator.create_demo(STAFF_DEMO_NAME)
  end
end

