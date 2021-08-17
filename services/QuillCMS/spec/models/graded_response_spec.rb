require 'rails_helper'

RSpec.describe GradedResponse, type: :model do
  context 'basic queries' do
    let!(:optimal) {create(:optimal_response, question_uid: '123')}
    let!(:nonoptimal) {create(:graded_nonoptimal_response, question_uid: '123')}
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
      graded_ids = [optimal.id, nonoptimal.id].sort

      expect(response_ids).to eq graded_ids
      expect(responses.first.attributes.keys.sort).to eq nonoptimal.attributes.keys.sort
    end
  end
end
