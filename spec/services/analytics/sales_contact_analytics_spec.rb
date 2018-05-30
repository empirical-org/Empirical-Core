require 'rails_helper'

describe 'SalesContactAnalytics' do
  it 'sends data to the client' do
    client = double('client')
    user   = create(:user, role: 'teacher')
    school = create(:school)
    school.users << user

    allow(client).to receive(:event) { double('instance', 'success?' => true) }
    expect(client).to receive(:event).with(
      contact_uid: user.id.to_s,
      event_uid: 'basic_subscription',
      params: {
        account_uid: school.id.to_s,
        display_name: 'Basic Subscription',
      }
    )

    SalesContactAnalytics.new(user.id, 'basic_subscription', client).track
  end

  it 'only sends data for valid stages' do
    client = double('client')
    user   = create(:user, role: 'teacher')
    school = create(:school)
    school.users << user

    allow(client).to receive(:event) { double('instance', 'success?' => true) }
    expect(client).not_to receive(:track)

    result = SalesContactAnalytics.new(user.id, 'dont_fake_the_funk', client)
      .track

    expect(result).to be false
  end
end
