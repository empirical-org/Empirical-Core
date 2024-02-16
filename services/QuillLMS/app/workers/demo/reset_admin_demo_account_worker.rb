# frozen_string_literal: true

# destroy admin demo account and recreates it from scratch
class Demo::ResetAdminDemoAccountWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  ADMIN_DEMO_EMAIL = "hello+demoadmin-admindemoschool@quill.org"

  def perform
    Demo::CreateAdminReport.new(ADMIN_DEMO_EMAIL).reset
  end
end
