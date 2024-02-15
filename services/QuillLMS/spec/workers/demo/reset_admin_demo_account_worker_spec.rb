# frozen_string_literal: true

require 'rails_helper'

describe Demo::ResetAdminDemoAccountWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    it "should call reset for the admin demo" do
      expect(Demo::CreateAdminReport).to receive(:new).with(described_class::STAFF_DEMO_EMAIL)
      expect_any_instance_of(Demo::CreateAdminReport).to receive(:reset)

      worker.perform
    end
  end
end
