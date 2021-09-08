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

  # it "does return false for show when the banner is only second and fourth out of the month and its the first week" do
  #   time =  DateTime.new(2021,3,3,16,0,0)
  #   banner = RecurringBanner.new(time)
  #   expect(banner.show?).to eq(false)
  # end

  # it "does return true for show when the banner is only second and fourth out of the month and its the second week" do
  #   time =  DateTime.new(2021,3,10,16,0,0)
  #   banner = RecurringBanner.new(time)
  #   expect(banner.show?("School Paid")).to eq(true)
  # end

  it "does return no link or title when the key does not have an associated webinar" do
    time =  DateTime.new(2020,1,1,11,0,0)
    banner = RecurringBanner.new(time)
    expect(banner.link).to eq(nil)
    expect(banner.title).to eq(nil)
  end

  it "does return true for show? when the key does have an associated webinar" do
    time =  DateTime.new(2021,9,2,11,1,0)
    banner = RecurringBanner.new(time)
    expect(banner.show?(true)).to eq(true)
  end

  it "does not return true for show? when the key falls on a skipped day" do
    time =  DateTime.new(2021,1,18,16,1,0)
    banner = RecurringBanner.new(time)
    expect(banner.show?(true)).to eq(false)
  end

  it "does return correct link and title when the key does have an associated recurring webinar" do
    time =  DateTime.new(2021,9,2,11,1,0)
    banner = RecurringBanner.new(time)
    expect(banner.title).to eq("<strong>Quill Webinar 101: Getting Started</strong> is live now!")
    expect(banner.link).to eq("https://quill-org.zoom.us/webinar/register/WN_vA0O4ltWSJKMLqghSm4otw")
  end

end
