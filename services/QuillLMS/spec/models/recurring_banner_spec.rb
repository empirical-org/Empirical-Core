# frozen_string_literal: true

require 'rails_helper'

describe RecurringBanner, type: :model do

  it "does return false for show? when the key does not have an associated webinar" do
    time =  DateTime.new(2020,1,1,11,0,0)
    banner = RecurringBanner.new(time)
    expect(banner.show?).to eq(false)
  end

  it 'does return false for show? when the user has no subscription and the banner is subscription only' do
    time =  DateTime.new(2021,3,11,16,1,0)
    banner = RecurringBanner.new(time)
    expect(banner.show?("Teacher Trial")).to eq(false)
  end

  it "does return no link or title when the key does not have an associated webinar" do
    time =  DateTime.new(2020,1,1,11,0,0)
    banner = RecurringBanner.new(time)
    expect(banner.link).to eq(nil)
    expect(banner.title).to eq(nil)
  end

  it "does not return true for show? when the key falls on a skipped day" do
    time =  DateTime.new(2021,1,18,16,1,0)
    banner = RecurringBanner.new(time)
    expect(banner.show?(true)).to eq(false)
  end

end
