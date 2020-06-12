class ResetDemoAccountWorker
  include Sidekiq::Worker

  def perform
    Demo::ReportDemoDestroyer.destroy_demo(nil)
    Demo::ReportDemoCreator.create_demo(nil)
  end
end

