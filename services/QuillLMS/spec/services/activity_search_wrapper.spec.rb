require 'rails_helper'

describe ActivitySearchWrapper do
  let!(:content_partner_1) { create(:content_partner) }
  let!(:content_partner_2) { create(:content_partner) }
  let!(:level_3_topic) { create(:topic, level: 3) }
  let!(:level_2_topic) { create(:topic, level: 2, parent_id: level_3_topic.id) }
  let!(:level_1_topic) { create(:topic, level: 1) }
  let!(:level_0_topic) { create(:topic, level: 0) }
  let!(:raw_score) { create(:raw_score, :eight_hundred_to_nine_hundred)}
  let!(:activity) { create(:activity, flags: ['production'], raw_score: raw_score) }

  it "will put both of an activity's content partners in the content partner array" do
    activity.content_partners = [content_partner_1, content_partner_2]
    activity.save
    result = ActivitySearchWrapper.new.search
    activity_from_result = result[:activities].find { |a| a[:id] == activity.id }
    expect(activity_from_result[:content_partners].length).to eq(2)
    expect(activity_from_result[:content_partners][0][:name]).to eq(content_partner_1.name)
    expect(activity_from_result[:content_partners][1][:name]).to eq(content_partner_2.name)
  end

  it "will put all of an activity's topics in the topic array" do
    activity.topics = [level_0_topic, level_1_topic, level_2_topic, level_3_topic]
    activity.save
    result = ActivitySearchWrapper.new.search
    activity_from_result = result[:activities].find { |a| a[:id] == activity.id }
    topics = activity_from_result[:topics]
    expect(topics.length).to eq(4)
    expect(topics.find { |t| t[:level] == "0" }[:name]).to eq(level_0_topic.name)
    expect(topics.find { |t| t[:level] == "1" }[:name]).to eq(level_1_topic.name)
    expect(topics.find { |t| t[:level] == "2" }[:name]).to eq(level_2_topic.name)
    expect(topics.find { |t| t[:level] == "3" }[:name]).to eq(level_3_topic.name)
  end

  it "will have the readability grade level of that activity" do
    result = ActivitySearchWrapper.new.search
    activity_from_result = result[:activities].find { |a| a[:id] == activity.id }
    expect(activity_from_result[:readability_grade_level]).to eq(activity.readability_grade_level)
  end
end
