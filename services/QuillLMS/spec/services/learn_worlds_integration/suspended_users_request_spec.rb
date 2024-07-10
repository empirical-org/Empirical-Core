# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::SuspendedUsersRequest do

  describe '#fetch_page' do
    let(:page_number) { 1 }

    context 'when the response is 200' do
      let(:response) { double(code: 200) }

      it 'returns the response' do
        allow(HTTParty).to receive(:get).and_return(response)

        expect(subject.fetch_page(page_number)).to eq(response)
      end
    end

    context 'when the response is 404' do
      let(:response) { double(code: 404) }

      it 'returns :no_users' do
        allow(HTTParty).to receive(:get).and_return(response)

        expect(subject.fetch_page(page_number)).to eq(:no_users)
      end
    end

    context 'when the response is unexpected' do
      let(:response) { double(code: 500, to_s: 'Error details') }

      it 'raises an UnexpectedApiResponse error' do
        allow(HTTParty).to receive(:get).and_return(response)

        expect { subject.fetch_page(page_number) }.to raise_error(
          LearnWorldsIntegration::Request::UnexpectedApiResponse, 'Error details'
        )
      end
    end
  end

  describe '#fetch_ids_to_suspend' do
    let(:request) { described_class.new }

    let(:initial_page) { { 'meta' => { 'totalPages' => 2 }, 'data' => [{ 'id' => 1 }] } }
    let(:second_page) { { 'data' => [{ 'id' => 2 }] } }

    before do
      allow(request).to receive(:fetch_page).with(1).and_return(initial_page)
      allow(request).to receive(:fetch_page).with(2).and_return(second_page)
    end

    it 'raises an error if totalPages is missing' do
      allow(request).to receive(:fetch_page).with(1).and_return({ 'meta' => {} })

      expect do
        request.fetch_ids_to_suspend
      end.to raise_error(
        LearnWorldsIntegration::Request::UnexpectedApiResponse,
        'No totalPages value'
      )
    end

    context 'initial page fetch is a 404' do
      it 'should return []' do
        allow(request).to receive(:fetch_page).with(1).and_return(:no_users)
        expect(request.fetch_ids_to_suspend).to eq []
      end
    end

    it 'fetches and combines user IDs from all pages' do
      result = request.fetch_ids_to_suspend

      expect(result).to match_array([1, 2])
    end
  end
end
