require 'rails_helper'

describe 'SalesContactAnalytics' do
  it 'sends data to the client' do
    client = double('segment_client')
    user   = create(:user, role: 'teacher')
    school = create(:school)
    school.users << user

    expect(client).to receive(:track).with(
      contact_uid: user.id,
      event: 'basic_subscription',
      params: {
        account_uid: school.id,
        display_name: 'Basic Subscription',
      }
    )

    SalesContactAnalytics.new(user.id, 'basic_subscription', client).track
  end

  it 'only sends data for valid stages' do
    client = double('segment_client')
    user   = create(:user, role: 'teacher')
    school = create(:school)
    school.users << user

    expect(client).not_to receive(:track)

    result = SalesContactAnalytics.new(user.id, 'dont_fake_the_funk', client)
      .track

    expect(result).to be false
  end
end
