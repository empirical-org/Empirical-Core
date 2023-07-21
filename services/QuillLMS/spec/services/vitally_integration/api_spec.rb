# frozen_string_literal: true

require 'rails_helper'

describe VitallyIntegration::Api do
  let(:api)  { described_class.new }

  let(:sample_response) { {body: '{}', headers: {content_type: 'application/json'}} }
  let(:mock_payload) { {} }

  before do
    stub_const('VitallyIntegration::Api::API_KEY', 'test api key')
    stub_request(:post, endpoint).to_return(response)
  end

  describe '#batch' do
    let(:endpoint) { "#{described_class::BASE_URL}/#{described_class::ENDPOINT_BATCH}"}
    let(:response) {sample_response.merge(status: 200) }

    subject {api.batch(mock_payload)}

    it 'should post the payload to the batch endpoint' do
      expect(subject.success?).to be true
    end

    context 'RateLimit error' do
      let(:response) {sample_response.merge(status: 429) }

      it { expect{subject}.to raise_error(described_class::RateLimitError) }
    end

    context 'Other error' do
      let(:response) {sample_response.merge(status: 500) }

      it { expect{subject}.to raise_error(described_class::ApiError) }
    end
  end

  describe '#unlink' do
    let(:endpoint) { "#{described_class::BASE_URL}/#{described_class::ENDPOINT_UNLINK}" }
    let(:response) {sample_response.merge(status: 200) }

    subject {api.unlink(mock_payload)}

    it 'should post the payload to the batch endpoint' do
      expect(subject.success?).to be true
    end

    context 'RateLimit error' do
      let(:response) {sample_response.merge(status: 429) }

      it { expect{subject}.to raise_error(described_class::RateLimitError) }
    end

    context 'Other error' do

      let(:response) {sample_response.merge(status: 500)}

      it { expect{subject}.to raise_error(described_class::ApiError).with_message("500") }
    end
  end
end
