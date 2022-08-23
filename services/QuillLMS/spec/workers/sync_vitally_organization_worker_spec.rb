# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyOrganizationWorker do
  subject { described_class.new }

  let(:district) { create(:district) }
  let(:response_double) { double }
  let(:vitally_api_double) { double }

  describe '#perform' do
    it 'build payload from district object and send them to Vitally' do
      expect(response_double).to receive(:code).and_return(200)
      expect(vitally_api_double).to receive(:create).with('organizations', district.vitally_data).and_return(response_double)
      expect(VitallyRestApi).to receive(:new).and_return(vitally_api_double)
      subject.perform(district.id)
    end

    it 'should re-queue via perform_in when the Vitally API call rate limits us' do
      expect(response_double).to receive(:code).and_return(429)
      expect(vitally_api_double).to receive(:create).and_return(response_double)
      expect(VitallyRestApi).to receive(:new).and_return(vitally_api_double)

      expect(SyncVitallyOrganizationWorker).to receive(:perform_in).with(anything, district.id)

      subject.perform(district.id)
    end
  end
end
