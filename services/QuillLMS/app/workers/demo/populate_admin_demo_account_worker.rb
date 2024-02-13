# frozen_string_literal: true

# destroy admin demo account and recreates it from scratch
class Demo::PopulateAdminDemoAccountWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW, retry: false

  ADMIN_DEMO_EMAIL = "hello+demoadmin-admindemoschool@quill.org"

  def perform
    Demo::CreateAdminReport.new(ADMIN_DEMO_EMAIL).reset
  end
end
