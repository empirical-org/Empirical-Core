require 'rails_helper'

RSpec.describe ResponseLabelTag, type: :model do
  it "should not be valid without a response" do
    rlt = build(:response_label_tag, response_id: nil)
    expect(rlt.valid?).to be(false)
  end
end
