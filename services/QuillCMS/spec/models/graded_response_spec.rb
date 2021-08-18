require 'rails_helper'

RSpec.describe GradedResponse, type: :model do
  context 'basic queries' do
    let!(:optimal) {create(:optimal_response, question_uid: '123')}
    let!(:graded_nonoptimal) {create(:graded_nonoptimal_response, question_uid: '123')}
    let!(:ungraded) {create(:ungraded_response, question_uid: '123')}

    it 'should return no records if refresh is not run' do
      expect(GradedResponse.count).to be 0
    end

    it 'should return 2 records when refreshed' do
      GradedResponse.refresh
      expect(GradedResponse.count).to be 2
    end

    it 'should return response objects for queries' do
      GradedResponse.refresh
      responses = GradedResponse.where(question_uid: '123').sort_by(&:id)
      response_ids = responses.map(&:id).sort
      graded_ids = [optimal.id, graded_nonoptimal.id].sort

      expect(response_ids).to eq graded_ids
    end


    # Note, if this test fails, you might need a migration for this view
    # Scenic View attributes are locked at the time of the view migration
    # So a query for responses.* doesn't update as you add fields
    # https://github.com/scenic-views/scenic#faqs
    it 'should have the same attributes as Response' do
      GradedResponse.refresh

      expect(GradedResponse.first.attributes.keys.sort).to eq Response.first.attributes.keys.sort
    end
  end
end
