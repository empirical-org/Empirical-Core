# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuillBigQuery::MaterializedViewsController do

  describe '#refresh' do
    subject { post :refresh, params: params, as: :json }

    let(:api_key) { '1234' }
    let(:view_key) {'some_key'}
    let(:params) { { api_key:, view_key: } }

    before do
      stub_const('QuillBigQuery::MaterializedViewsController::API_KEY', api_key)
    end

    it 'should call for valid API key' do
      expect(QuillBigQuery::MaterializedViewRefreshWorker).to receive(:perform_async).with(view_key)

      subject
    end

    context 'multiple keys' do
      let(:view_key2) { 'some_other_key' }
      let(:view_key_param) { "#{view_key},#{view_key2}" }
      let(:params) { { api_key:, view_key: view_key_param } }

      it 'should enqueue every comma-separated job passed in' do
        expect(QuillBigQuery::MaterializedViewRefreshWorker).to receive(:perform_async).with(view_key)
        expect(QuillBigQuery::MaterializedViewRefreshWorker).to receive(:perform_async).with(view_key2)

        subject
      end
    end

    context 'no API_KEY set' do
      before do
        stub_const('QuillBigQuery::MaterializedViewsController::API_KEY', '')
      end

      it { expect {subject}.to raise_error(QuillBigQuery::MaterializedViewsController::InvalidRequestError) }
    end

    context 'wrong api_key' do
      let(:incorrect_key) { 'incorrect' }
      let(:params) { { api_key: incorrect_key, view_key: } }

      it { expect {subject}.to raise_error(QuillBigQuery::MaterializedViewsController::InvalidRequestError) }
    end
  end
end
