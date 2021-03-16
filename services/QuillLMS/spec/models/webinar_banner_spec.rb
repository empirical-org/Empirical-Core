require 'rails_helper'

describe WebinarBanner, type: :model do

  it "does return false for show? when the key does not have an associated webinar" do
    time =  DateTime.new(2020,1,1,11,0,0)
    banner = WebinarBanner.new(time)
    expect(banner.show?(true)).to eq(false)
  end

  it 'does return false for show? when the user has no subscription and the banner is subscription only' do
    time =  DateTime.new(2021,3,10,16,1,0)
    banner = WebinarBanner.new(time)
    expect(banner.show?(false)).to eq(false)
  end

  it "does return false for show when the banner is only second and fourth out of the month and its the first week" do
    time =  DateTime.new(2021,3,3,16,0,0)
    banner = WebinarBanner.new(time)
    expect(banner.show?(true)).to eq(false)
  end

  it "does return true for show when the banner is only second and fourth out of the month and its the second week" do
    time =  DateTime.new(2021,3,10,16,0,0)
    banner = WebinarBanner.new(time)
    expect(banner.show?(true)).to eq(true)
  end

  it "does return no link or title when the key does not have an associated webinar" do
    time =  DateTime.new(2020,1,1,11,0,0)
    banner = WebinarBanner.new(time)
    expect(banner.link).to eq(nil)
    expect(banner.title).to eq(nil)
  end

  it "does return true for show? when the key does have an associated webinar" do
    time =  DateTime.new(2021,1,4,16,1,0)
    banner = WebinarBanner.new(time)
    expect(banner.show?(true)).to eq(true)
  end

  it "does not return true for show? when the key falls on a skipped day" do
    time =  DateTime.new(2021,1,18,16,1,0)
    banner = WebinarBanner.new(time)
    expect(banner.show?(true)).to eq(false)
  end

  # not running this test for now because we don't have any one-off webinars scheduled
  xit "does return correct link and title when the key does have an associated one-off webinar" do
    time =  DateTime.new(2020,12,16,16,1,0)
    banner = WebinarBanner.new(time)
    expect(banner.title).to eq("Quill's Spotlight on Encouraging & Empowering Your Writers")
    expect(banner.link).to eq("https://quill-org.zoom.us/webinar/register/WN_yB6Lltm3QH2h4AnobnCdLw")
  end

  it "does return correct link and title when the key does have an associated recurring webinar" do
    time =  DateTime.new(2021,1,4,16,1,0)
    banner = WebinarBanner.new(time)
    expect(banner.title).to eq("<strong>Quill Webinar 101: Getting Started</strong> is live now!")
    expect(banner.link).to eq("https://quill-org.zoom.us/webinar/register/WN_a4Z1_Zs6RSGUWwr_t0V18Q")
  end

end
