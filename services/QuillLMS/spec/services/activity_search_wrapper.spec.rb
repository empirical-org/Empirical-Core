require 'rails_helper'

describe ActivitySearchWrapper do
  let!(:content_partner_1) { create(:content_partner) }
  let!(:content_partner_2) { create(:content_partner) }
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

  it "will have the readability grade level of that activity" do
    result = ActivitySearchWrapper.new.search
    activity_from_result = result[:activities].find { |a| a[:id] == activity.id }
    expect(activity_from_result[:readability_grade_level]).to eq(activity.readability_grade_level)
  end
end
