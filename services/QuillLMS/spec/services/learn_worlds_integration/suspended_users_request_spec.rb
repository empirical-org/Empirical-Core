# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::SuspendedUsersRequest do
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
        "No totalPages value"
      )
    end

    it 'fetches and combines user IDs from all pages' do
      result = request.fetch_ids_to_suspend

      expect(result).to match_array([1, 2])
    end
  end
end
