# frozen_string_literal: true

require 'rails_helper'

describe VitallyApi do
  let(:api)  { VitallyApi.new }

  let(:sample_response) { {body: '{}', headers: {content_type: 'application/json'}} }
  let(:mock_payload) { {} }

  before do
    stub_const("VitallyApi::API_KEY", 'test api key')
    stub_request(:post, endpoint).to_return(response)
  end

  describe '#batch' do
    let(:endpoint) { VitallyApi::BASE_URL + '/' + VitallyApi::ENDPOINT_BATCH }
    let(:subject) {api.batch(mock_payload)}
    let(:response) {sample_response.merge(status: 200) }

    it 'should post the payload to the batch endpoint' do
      expect(subject.success?).to be true
    end

    context 'RateLimit error' do
      let(:response) {sample_response.merge(status: 429) }

      it { expect{subject}.to raise_error(VitallyApi::RateLimitError) }
    end

    context 'Other error' do
      let(:response) {sample_response.merge(status: 500) }

      it { expect{subject}.to raise_error(VitallyApi::ApiError) }
    end
  end

  describe '#unlink' do
    let(:endpoint) { VitallyApi::BASE_URL + '/' + VitallyApi::ENDPOINT_UNLINK }
    let(:subject) {api.unlink(mock_payload)}
    let(:response) {sample_response.merge(status: 200) }

    it 'should post the payload to the batch endpoint' do
      expect(subject.success?).to be true
    end

    context 'RateLimit error' do
      let(:response) {sample_response.merge(status: 429) }

      it { expect{subject}.to raise_error(VitallyApi::RateLimitError) }
    end

    context 'Other error' do

      let(:response) {sample_response.merge(status: 500)}

      it { expect{subject}.to raise_error(VitallyApi::ApiError).with_message("500") }
    end
  end
end
