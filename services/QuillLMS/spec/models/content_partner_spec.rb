require 'rails_helper'

describe ContentPartner do
  it {
    should validate_presence_of :name
    should have_many :content_partner_activities
  }

  let!(:content_partner) { create(:content_partner) }

  it "should send callback after commit" do
    expect(Activity).to receive(:clear_activity_search_cache)
    content_partner.run_callbacks(:commit)
  end

end
