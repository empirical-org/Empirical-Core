require 'rails_helper'

RSpec.describe 'notifications/index' do
  it 'renders the json' do
    user         = build(:simple_user, role: 'student', name: 'Jimmy McGee')
    notification = build(:notification,
      user: user,
      meta: { activity_student_report_path: '/cool' }
    )
    assign(:notifications, [notification])

    render
    notifications_json = JSON.parse(rendered)

    expect(notifications_json).to eq([
      { 'text' => 'text', 'href' => '/cool' }
    ])
  end
end
