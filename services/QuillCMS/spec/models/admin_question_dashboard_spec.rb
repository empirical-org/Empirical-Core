require "rails_helper"

RSpec.describe AdminQuestionDashboard do

  describe "#question_dashboard_data" do
    before do
      allow_any_instance_of(Response).to receive(:create_index_in_elastic_search)
    end

    let!(:question_uid) { SecureRandom.uuid}
    let!(:response1) { create(:response, question_uid: question_uid, optimal: nil, count: 20)}
    let!(:response2) { create(:response, question_uid: question_uid, optimal: false, author: "Modified Word Hint", count: 20)}
    let!(:response3) { create(:response, question_uid: question_uid, optimal: false, author: "Required Words Hint", count: 20)}
    let!(:response4) { create(:response, question_uid: question_uid, optimal: false, author: "Spelling Hint", count: 20)}
    let!(:response5) { create(:response, question_uid: question_uid, optimal: true, count: 20)}

    it "provides the correct question dashboard data" do
      question_dashboard = AdminQuestionDashboard.new(question_uid)
      expect(question_dashboard.health[:percent_common_unmatched]).to eq(20)
      expect(question_dashboard.health[:percent_specified_algos]).to eq(40)
    end

    it "provides the correct question dashboard data when there are no responses" do
      random_uid = SecureRandom.uuid
      question_dashboard = AdminQuestionDashboard.new(random_uid)
      expect(question_dashboard.health[:percent_common_unmatched]).to eq(0)
      expect(question_dashboard.health[:percent_specified_algos]).to eq(0)
    end
  end
end
