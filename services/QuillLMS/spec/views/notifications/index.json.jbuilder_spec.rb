require 'rails_helper'

RSpec.describe 'notifications/index' do
  it 'renders the json' do
    user = create(:simple_user, role: 'student', name: 'Jimmy McGee')
    notification = create(:notification, user: user)
    assign(:notifications, [notification])

    render
    notifications_json = JSON.parse(rendered)

    expect(notifications_json).to eq([
      { 'text' => 'text', 'user' => 'Jimmy Mcgee' }
    ])
  end
end
