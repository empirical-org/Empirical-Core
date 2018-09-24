require 'rails_helper'

describe AuthorizedUserForActivity do

  it 'returns true when user is staff' do
    user = create(:user, role: 'staff')
    session = create(:activity_session, user: user)

    result = AuthorizedUserForActivity.new(user, session).call

    expect(result).to be true
  end

  it 'returns false when activity session is blank' do
    user = create(:user, role: 'student')
    session = nil

    result = AuthorizedUserForActivity.new(user, session).call

    expect(result).to be false
  end

  it 'returns false when activity session user is not the same as given user' do
    user = create(:user, role: 'student')
    session = create(:activity_session, user: user)
    another_user = create(:user, role: 'student')

    result = AuthorizedUserForActivity.new(another_user, session).call

    expect(result).to be false
  end

  it 'returns true when activity session user is the same as given user' do
    user = create(:user, role: 'student')
    session = create(:activity_session, user: user)

    result = AuthorizedUserForActivity.new(user, session).call

    expect(result).to be true
  end
end
