# frozen_string_literal: true

require 'rails_helper'

describe Demo::ResetAdminDemoAccountWorker, type: :worker do
  let(:worker) { described_class.new }

  let(:admin_report_instance) { instance_double("Demo::CreateAdminReport") }

  before do
    allow(Demo::CreateAdminReport).to receive(:new).with(described_class::ADMIN_DEMO_EMAIL).and_return(admin_report_instance)
    allow(admin_report_instance).to receive(:reset)
  end

  it "calls reset on the Demo::CreateAdminReport instance" do
    expect(admin_report_instance).to receive(:reset)

    worker.perform
  end
end
