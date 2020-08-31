class ResetDemoAccountWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform
    Demo::ReportDemoDestroyer.destroy_demo(nil)
    Demo::ReportDemoCreator.create_demo(nil)
  end
end

