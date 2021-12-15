# frozen_string_literal: true

require 'rails_helper'

describe ResetDemoAccountWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    it "should destroy and then create a new demo" do
      expect(Demo::ReportDemoDestroyer).to receive(:destroy_demo).with(nil)
      expect(Demo::ReportDemoCreator).to receive(:create_demo).with(nil)

      expect(Demo::ReportDemoDestroyer).to receive(:destroy_demo).with(ResetDemoAccountWorker::STAFF_DEMO_EMAIL)
      expect(Demo::ReportDemoCreator).to receive(:create_demo).with(ResetDemoAccountWorker::STAFF_DEMO_EMAIL)
      worker.perform
    end
  end
end
