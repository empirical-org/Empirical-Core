require 'rails_helper'

RSpec.describe 'notifications/index' do
  it 'renders the json' do
    notification = create(:notification)
    assign(:notifications, [notification])

    render
    notifications_json = JSON.parse(rendered)

    expect(notifications_json).to eq([ { 'text' => 'text' } ])
  end
end
