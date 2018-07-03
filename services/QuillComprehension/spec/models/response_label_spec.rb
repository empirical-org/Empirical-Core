require 'rails_helper'

RSpec.describe ResponseLabel, type: :model do
  it "has many response label tags" do
    response_label = create(:response_label)
    response = create(:response)
    rlt1 = create(:response_label_tag, response: response, response_label: response_label)
    rlt2 = create(:response_label_tag, response: response, response_label: response_label)

    expect(response_label.response_label_tags.count).to eq(2)
  end
end
