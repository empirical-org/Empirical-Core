require 'rails_helper'

RSpec.describe MultipleChoiceResponse, type: :model do
  context 'basic queries' do
    let!(:ungraded) {create(:ungraded_response, question_uid: '123', count: 15)}
    let!(:graded_nonoptimal) {create(:graded_nonoptimal_response, question_uid: '123', count: 19)}
    let!(:ungraded2) {create(:ungraded_response, question_uid: '123', count: 17)}
    let!(:optimal) {create(:optimal_response, question_uid: '123', count: 9999)}

    it 'should return no records if refresh is not run' do
      expect(MultipleChoiceResponse.count).to be 0
    end

    it 'should return 2 records when refreshed' do
      MultipleChoiceResponse.refresh
      expect(MultipleChoiceResponse.count).to be 2
    end

    it 'should return response objects for queries' do
      MultipleChoiceResponse.refresh
      responses = MultipleChoiceResponse.where(question_uid: '123')
      response_ids = responses.map(&:id).sort
      highest_two_count_ids = [graded_nonoptimal.id, ungraded2.id].sort

      expect(response_ids).to eq highest_two_count_ids
    end

    # Note, if this test fails, you might need a migration for this view
    # Scenic View attributes are locked at the time of the view migration
    # So a query for responses.* doesn't update as you add fields
    # https://github.com/scenic-views/scenic#faqs
    it 'should have the same attributes as Response' do
      MultipleChoiceResponse.refresh

      expect(MultipleChoiceResponse.first.attributes.keys.sort).to eq Response.first.attributes.keys.sort
    end
  end

  context 'rank ties' do
    before do
      create(:ungraded_response, question_uid: '123', count: 15)
      create(:graded_nonoptimal_response, question_uid: '123', count: 19)
      create(:ungraded_response, question_uid: '123', count: 15)
      create(:optimal_response, question_uid: '123', count: 9999)
    end

    it 'should return additional records when there is a tie for 2nd rank' do
      # return 3 returns for counts 19,15,15
      MultipleChoiceResponse.refresh
      expect(MultipleChoiceResponse.count).to be 3
    end
  end

  context 'records with less than 10 count' do
    before do
      create(:graded_nonoptimal_response, question_uid: '123', count: 10)
      create(:ungraded_response, question_uid: '123', count: 9)
    end

    it 'should not be returned by the query' do
      MultipleChoiceResponse.refresh
      expect(MultipleChoiceResponse.count).to be 0
    end
  end
end
