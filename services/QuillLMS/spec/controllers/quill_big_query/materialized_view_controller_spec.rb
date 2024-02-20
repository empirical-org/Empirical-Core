# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuillBigQuery::MaterializedViewsController do

  describe '#refresh' do
    subject { post :refresh, params: params, as: :json }

    let(:api_key) { '1234' }
    let(:query_key) {'some_key'}
    let(:params) { { api_key:, query_key: } }

    before do
      stub_const('QuillBigQuery::MaterializedViewsController::API_KEY', api_key)
    end

    it 'should call for valid API key' do
      expect(QuillBigQuery::MaterializedViewRefreshWorker).to receive(:perform_async).with(query_key)

      subject
    end

    context 'no API_KEY set' do
      before do
        stub_const('QuillBigQuery::MaterializedViewsController::API_KEY', '')
      end

      it { expect {subject}.to raise_error(QuillBigQuery::MaterializedViewsController::InvalidRequestError) }
    end

    context 'wrong api_key' do
      let(:incorrect_key) { 'incorrect' }
      let(:params) { { api_key: incorrect_key, query_key: } }

      it { expect {subject}.to raise_error(QuillBigQuery::MaterializedViewsController::InvalidRequestError) }
    end
  end
end
