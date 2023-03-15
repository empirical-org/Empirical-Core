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

    context 'email verification' do
      let(:clever_id) { nil }
      let(:google_id) { nil }
      let(:user) { create(:admin, clever_id: clever_id, google_id: google_id) }
      let(:verification_email_double) { double(deliver_now!: nil) }


      describe 'when the user is not a google or clever user' do
        it 'creates a user email verification record' do
          CompleteAccountCreation.new(user, 'some_ip').call
          expect(UserEmailVerification.find_by(user_id: user.id)).to be
        end

        it 'sends an verification email to the user' do
          expect(UserMailer).to receive(:email_verification_email).and_return(verification_email_double)

          CompleteAccountCreation.new(user, 'some_ip').call
        end
      end

      describe 'when the user is a google user' do
        let(:google_id) { 1 }

        it 'marks the user as email verified' do
          CompleteAccountCreation.new(user, 'some_ip').call

          expect(user.email_verified?).to be(true)
          expect(user.user_email_verification.verification_method).to eq(UserEmailVerification::GOOGLE_VERIFICATION)
        end

        it 'does not send an verification email to the user' do
          expect(UserMailer).not_to receive(:email_verification_email)

          CompleteAccountCreation.new(user, 'some_ip').call
        end
      end

      describe 'when the user is a clever user' do
        let(:clever_id) { 1 }

        it 'marks the user as email verified' do
          CompleteAccountCreation.new(user, 'some_ip').call

          expect(user.email_verified?).to be(true)
          expect(user.user_email_verification.verification_method).to eq(UserEmailVerification::CLEVER_VERIFICATION)
        end

        it 'does not send an verification email to the user' do
          expect(UserMailer).not_to receive(:email_verification_email)

          CompleteAccountCreation.new(user, 'some_ip').call
        end
      end
    end

  end
end
