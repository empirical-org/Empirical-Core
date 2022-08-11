# frozen_string_literal: true

require 'rails_helper'

describe OneOffBanner, type: :model do

  it "does return false for show? when the key does not have an associated webinar" do
    time =  DateTime.new(2020,1,1,11,0,0)
    banner = OneOffBanner.new(time)
    expect(banner.show?).to eq(false)
  end

  it "does return no link or title when the key does not have an associated webinar" do
    time =  DateTime.new(2020,1,1,11,0,0)
    banner = OneOffBanner.new(time)
    expect(banner.link).to eq(nil)
    expect(banner.title).to eq(nil)
  end

  it "does return true for show? when the key does have an associated webinar" do
    time =  DateTime.new(2022,8,10,11,1,0)
    banner = OneOffBanner.new(time)
    expect(banner.show?).to eq(true)
  end

  it "does not return true for show? when the key falls on a skipped day" do
    time =  DateTime.new(2021,1,18,16,1,0)
    banner = OneOffBanner.new(time)
    expect(banner.show?).to eq(false)
  end

  it "does return correct link and title when the key does have an associated recurring webinar" do
    time =  DateTime.new(2022,8,10,11,1,0)
    banner = OneOffBanner.new(time)
    expect(banner.title).to eq("The webinar <strong>Back to School with Quill: Learn the Basics</strong> is live now!")
    expect(banner.link).to eq("https://quill-org.zoom.us/webinar/register/WN_2LfW2CGRSfyfJzv79kF_2Q#/registration")
    expect(banner.link_display_text).to eq("Click here to register and join.")
  end

  describe "custom_length" do
    let(:hour_minute1) {DateTime.new(2022,8,15,10,1,0)}
    let(:hour_minute30) {DateTime.new(2022,8,15,10,30,0)}
    let(:banner_minute1) {OneOffBanner.new(hour_minute1)}
    let(:banner_minute30) {OneOffBanner.new(hour_minute30)}

    let(:banner_config) do
      {
        title: "title!",
        link_display_text: 'link_text',
        link: "url",
        custom_length: 29
      }
    end

    before do
      stub_const("OneOffBanner::WEBINARS", {'8-15-10' => banner_config})
    end

    it "should show before the custom length ends" do
      expect(banner_minute1.show?).to be true
    end

    it "should hide after the custom length ends" do
      expect(banner_minute30.show?).to be false
    end
  end
end
