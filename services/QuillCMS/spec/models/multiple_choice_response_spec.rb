require 'rails_helper'

RSpec.describe MultipleChoiceResponse, type: :model do
  context 'basic queries' do
    let!(:ungraded) {create(:response, question_uid: '123', optimal: nil, count: 5)}
    let!(:nonoptimal) {create(:response, question_uid: '123', optimal: false, count: 9)}
    let!(:ungraded2) {create(:response, question_uid: '123', optimal: nil, count: 7)}
    let!(:graded) {create(:response, question_uid: '123', optimal: true, count: 9999)}

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
      highest_two_count_ids = [nonoptimal.id, ungraded2.id].sort

      expect(response_ids).to eq highest_two_count_ids
      expect(responses.first.attributes.keys.sort).to eq nonoptimal.attributes.keys.sort
    end
  end

  context 'rank ties' do
    let!(:ungraded) {create(:response, question_uid: '123', optimal: nil, count: 5)}
    let!(:nonoptimal) {create(:response, question_uid: '123', optimal: false, count: 9)}
    let!(:ungraded2) {create(:response, question_uid: '123', optimal: nil, count: 5)}
    let!(:graded) {create(:response, question_uid: '123', optimal: true, count: 9999)}

    it 'should return additional records when there is a tie for 2nd rank' do
      # return 3 returns for counts 9,5,5
      MultipleChoiceResponse.refresh
      expect(MultipleChoiceResponse.count).to be 3
    end
  end
end
