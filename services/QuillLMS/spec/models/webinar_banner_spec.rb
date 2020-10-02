require 'rails_helper'

describe WebinarBanner, type: :model do

  it "does return false for show? when the key does not have an associated webinar" do
    time =  DateTime.new(2020,1,1,10,0,0)
    banner = WebinarBanner.new(time)
    expect(banner.show?).to eq(false)
  end

  it "does return no link or title when the key does not have an associated webinar" do
    time =  DateTime.new(2020,1,1,10,0,0)
    banner = WebinarBanner.new(time)
    expect(banner.link).to eq(nil)
    expect(banner.title).to eq(nil)
  end

  it "does return true for show? when the key does have an associated webinar" do
    time =  DateTime.new(2020,10,14,11,1,0)
    banner = WebinarBanner.new(time)
    expect(banner.show?).to eq(true)
  end

  it "does return correct link and title when the key does have an associated one-off webinar" do
    time =  DateTime.new(2020,10,14,11,1,0)
    banner = WebinarBanner.new(time)
    expect(banner.title).to eq("Quill's Spotlight on Ways to Use Quill with Google Classroom")
    expect(banner.link).to eq("https://quill-org.zoom.us/webinar/register/WN_DhZRpHV7Q4K413v4SzcK1A")
  end

  it "does return correct link and title when the key does have an associated recurring webinar" do
    time =  DateTime.new(2020,10,26,16,1,0)
    banner = WebinarBanner.new(time)
    expect(banner.title).to eq("Quill 101")
    expect(banner.link).to eq("https://quill-org.zoom.us/webinar/register/WN_a4Z1_Zs6RSGUWwr_t0V18Q")
  end

end