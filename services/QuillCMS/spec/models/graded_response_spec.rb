require 'rails_helper'

RSpec.describe GradedResponse, type: :model do
  context 'basic queries' do
    let!(:response_optimal) {create(:response, question_uid: '123', optimal: true)}
    let!(:response_nonoptimal) {create(:response, question_uid: '123', optimal: false)}
    let!(:response_ungraded) {create(:response, question_uid: '123', optimal: nil)}


    it 'should return no records if refresh is not run' do
      expect(GradedResponse.count).to be 0
    end

    it 'should return 2 records when refreshed' do
      GradedResponse.refresh
      expect(GradedResponse.count).to be 2
    end

    it 'should return response objects for queries' do
      GradedResponse.refresh
      graded_responses = GradedResponse.where(question_uid: '123').sort_by(&:id)

      expect(graded_responses.first.id).to be response_optimal.id
      expect(graded_responses.second.id).to be response_nonoptimal.id
    end
  end
end
