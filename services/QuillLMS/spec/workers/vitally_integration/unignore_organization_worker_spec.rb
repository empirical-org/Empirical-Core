# frozen_string_literal: true

require 'rails_helper'

module VitallyIntegration
  describe UnignoreOrganizationWorker do
    subject { described_class.new.perform(district.id) }

    let(:district) { create(:district) }

    it do
      expect(UnignoreOrganization).to receive(:run).with(district.id)
      subject
    end
  end
end
