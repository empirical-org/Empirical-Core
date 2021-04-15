require "rails_helper"

RSpec.describe ResponseAggregator do
  include ResponseAggregator

  describe "#question_dashboard_data" do
    before do
      allow_any_instance_of(Response).to receive(:create_index_in_elastic_search)
    end

    let!(:question_uid) { SecureRandom.uuid}
    let!(:response_1) { create(:response, question_uid: question_uid, parent_id: nil, optimal: nil, count: 20)}
    let!(:response_2) { create(:response, question_uid: question_uid, parent_id: nil, optimal: false, author: "Modified Word Hint", count: 20)}
    let!(:response_3) { create(:response, question_uid: question_uid, parent_id: nil, optimal: false, author: "Required Words Hint", count: 20)}
    let!(:response_4) { create(:response, question_uid: question_uid, parent_id: nil, optimal: false, author: "Spelling Hint", count: 20)}
    let!(:response_5) { create(:response, question_uid: question_uid, parent_id: nil, optimal: true, count: 20)}

    it "provides the correct question dashboard data" do
      expect(question_dashboard_data(question_uid)[:percent_common_unmatched]).to eq(20)
      expect(question_dashboard_data(question_uid)[:percent_specified_algos]).to eq(40)
    end

    it "provides the correct question dashboard data when there are no responses" do
      random_uid = SecureRandom.uuid
      expect(question_dashboard_data(random_uid)[:percent_common_unmatched]).to eq(0)
      expect(question_dashboard_data(random_uid)[:percent_specified_algos]).to eq(0)
    end
  end
end
