# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::StudentUpdater do
  subject { described_class.run(student, data) }

  let(:student) { create(:student, :with_canvas_account) }
  let(:canvas_account) { student.canvas_accounts.first }
  let(:user_external_id) { canvas_account.user_external_id }
  let(:email) { student.email }
  let(:name) { student.name }

  let(:data) do
    {
      email: email,
      name: name,
      user_external_id: user_external_id
    }
  end

  context 'student has no email' do
    before { student.update(email: nil) }

    context 'nil email provided' do
      let(:email) { nil }

      it { expect { subject }.to_not change(student, :email) }
    end

    context 'another user has email' do
      let(:email) { Faker::Internet.email }

      before { create(:student, email: email) }

      it { expect { subject }.to_not change(student, :email) }
    end

    context 'provided email is new and not taken' do
      let(:email) { Faker::Internet.email }

      it { expect { subject }.to change(student, :email).to(email) }
    end
  end

  context 'student has email' do
    context 'nil email provided' do
      let(:email) { nil }

      it { expect { subject }.to_not change(student, :email) }
    end

    context 'initial_email and email are the same' do
      it { expect { subject }.to_not change(student, :email) }

      it do
        expect(User).not_to receive(:exists?).with(email: email)
        subject
      end
    end

    context 'another user has email' do
      let(:email) { Faker::Internet.email }

      before { create(:student, email: email) }

      it { expect { subject }.to_not change(student, :email) }
    end

    context 'provided email is new and not taken' do
      let(:email) { Faker::Internet.email }

      it { expect { subject }.to change(student, :email).to(email) }
    end
  end

  context 'nil name provided' do
    let(:name) { nil }

    it { expect { subject }.to_not change(student, :name) }
  end

  context 'new name provided' do
    let(:name) { Faker::Name.custom_name }

    it { expect { subject }.to change(student, :name).to(name) }
  end

  context 'account type is not canvas' do
    before { student.update(account_type: nil) }

    it { expect { subject }.to change(student, :account_type).to(User::CANVAS_ACCOUNT) }
  end

  context 'clever_id is present' do
    before { student.update(clever_id: Faker::Number.number) }

    it { expect { subject }.to change(student, :clever_id).to(nil) }
  end

  context 'google_id is present' do
    before { student.update(google_id: Faker::Number.number) }

    it { expect { subject }.to change(student, :google_id).to(nil) }
  end

  context 'role is not student' do
    before { student.update(role: User::TEACHER) }

    it { expect { subject }.to change(student, :role).to(User::STUDENT) }
  end

  context 'signed_up_with_google is true' do
    before { student.update(signed_up_with_google: true) }

    it { expect { subject }.to change(student, :signed_up_with_google).to(false) }
  end
end
