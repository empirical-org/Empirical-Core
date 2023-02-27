# frozen_string_literal: true

require 'rails_helper'

describe CompleteAccountCreation do

  it 'triggers account creation when user is a teacher' do
    user = create(:user, role: 'teacher')

    expect(AccountCreationWorker).to receive(:perform_async).with(user.id)

    CompleteAccountCreation.new(user, 'some_ip').call
  end

  it 'triggers the iplocation worker when user is a teacher' do
    user = create(:user, role: 'teacher')

    expect(IpLocationWorker).to receive(:perform_async).with(user.id, 'some_ip')

    CompleteAccountCreation.new(user, 'some_ip').call
  end

  it 'triggers the account creation worker when user is student' do
    user = create(:user, role: 'student')

    expect(AccountCreationWorker).to receive(:perform_async).with user.id

    CompleteAccountCreation.new(user, 'some_ip').call
  end

  context 'when the user is an admin' do

    it 'creates an admin info record' do
      user = create(:admin)
      CompleteAccountCreation.new(user, 'some_ip').call

      expect(AdminInfo.find_by(user_id: user.id)).to be
    end

    describe 'when the user is not a google or clever user' do
      let!(:user) { create(:admin, google_id: nil, clever_id: nil) }

      it 'creates a user email verification record' do
        CompleteAccountCreation.new(user, 'some_ip').call
        expect(UserEmailVerification.find_by(user_id: user.id)).to be
      end
    end

  end
end
