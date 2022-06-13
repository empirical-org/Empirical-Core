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
    time =  DateTime.new(2022,5,12,11,1,0)
    banner = OneOffBanner.new(time)
    expect(banner.show?).to eq(true)
  end

  it "does not return true for show? when the key falls on a skipped day" do
    time =  DateTime.new(2021,1,18,16,1,0)
    banner = OneOffBanner.new(time)
    expect(banner.show?).to eq(false)
  end

  it "does return correct link and title when the key does have an associated recurring webinar" do
    time =  DateTime.new(2022,5,12,11,1,0)
    banner = OneOffBanner.new(time)
    expect(banner.title).to eq("<strong>Webinar: Wrapping Up the School Year with Quill</strong> is live now!")
    expect(banner.link).to eq("https://quill-org.zoom.us/webinar/register/WN_m7Yc_C87RUu5sLW8yTz4eA#/registration")
  end

end
