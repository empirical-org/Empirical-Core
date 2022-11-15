# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyOrganizationWorker do
  subject { described_class.new }

  let(:endpoint) { VitallyRestApi::BASE_URL + '/' + VitallyRestApi::ENDPOINT_ORGANIZATIONS }

  let(:district) { create(:district) }
  let(:response_double) { double(success?: true) }
  let(:vitally_api_double) { double }

  describe '#perform' do
    it 'build payload from district object and send them to Vitally' do
      expect(vitally_api_double).to receive(:create).with('organizations', district.vitally_data).and_return(response_double)
      expect(VitallyRestApi).to receive(:new).and_return(vitally_api_double)

      subject.perform(district.id)
    end

    context 'RateLimitError' do
      let(:response_double) { double(success?: false, code: 429) }

      it 'build payload from district object and send them to Vitally' do
        expect(vitally_api_double).to receive(:create).with('organizations', district.vitally_data).and_return(response_double)
        expect(VitallyRestApi).to receive(:new).and_return(vitally_api_double)

        expect { subject.perform(district.id) }.to raise_error(VitallyRestApi::RateLimitError)
      end
    end

    context 'RateLimitError' do
      let(:response_double) { double(success?: false, code: 500) }

      it 'build payload from district object and send them to Vitally' do
        expect(vitally_api_double).to receive(:create).with('organizations', district.vitally_data).and_return(response_double)
        expect(VitallyRestApi).to receive(:new).and_return(vitally_api_double)

        expect { subject.perform(district.id) }.to raise_error(VitallyRestApi::ApiError)
      end
    end
  end
end
