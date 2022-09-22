# frozen_string_literal: true

require 'rails_helper'

describe Demo::RecreateAccountWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    it "should destroy and then create a new demo" do
      expect(Demo::ReportDemoCreator).to receive(:create_demo).with(nil, {:teacher_demo=>true})
      expect(Demo::ReportDemoCreator).to receive(:create_demo).with(described_class::STAFF_DEMO_EMAIL)

      worker.perform
    end
  end
end
