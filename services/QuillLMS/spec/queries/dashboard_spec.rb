require 'rails_helper'

describe Dashboard, redis: true do
  let(:classroom_with_sufficient_data) {create(:classroom_with_3_classroom_units)}
  let(:teacher_with_sufficient_data) {classroom_with_sufficient_data.owner}
  let(:classroom_with_no_activities) {create(:classroom)}
  let(:teacher_with_no_activities) {classroom_with_no_activities.owner}

  before do
    stub_const("Dashboard::SUFFICIENT_DATA_AMOUNT", 3)
    stub_const("Dashboard::RESULT_LIMITS", 2)
    $redis.redis.flushdb
  end

  context 'when there are no completed activities' do
    it "returns results that state insufficient data" do
      results = Dashboard.queries(teacher_with_no_activities)
      expect(results.map{|x| x[:results]}.uniq).to eq( ["insufficient data"])
    end
  end

  context 'when there are more than 30 completed activities' do
    it "returns the 5 students" do
      results = Dashboard.queries(teacher_with_sufficient_data)
      expect(results.map{|x| x[:results].length}.uniq).to eq( [Dashboard::RESULT_LIMITS])
    end

    it "returns the lowest scoring student" do
      results = Dashboard.queries(teacher_with_sufficient_data)
      cu_ids = ClassroomUnit.where(classroom_id: classroom_with_sufficient_data.id).ids
      name_of_lowest = ActivitySession.where(classroom_unit_id: cu_ids).order('percentage asc').limit(1).first.user.name
      expect(results.to_s).to include(name_of_lowest)
    end
  end

  context 'when it is called' do
    it "sets a cache if none exsits" do
      expect($redis.keys.length).to eq(0)
      Dashboard.queries(teacher_with_sufficient_data)
      expect($redis.keys.length).to eq(2)
    end

    it "returns a cache if one does exist" do
      $redis.set('user_id:1_difficult_concepts', "fake cache")
      expect($redis.get("user_id:1_difficult_concepts")).to eq("fake cache")
    end
  end
end
