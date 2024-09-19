# frozen_string_literal: true

module VitallyIntegration
  class UnignoreOrganizationWorker
    include Sidekiq::Worker

    def perform(district_id)
      UnignoreOrganization.run(district_id)
    end
  end
end
