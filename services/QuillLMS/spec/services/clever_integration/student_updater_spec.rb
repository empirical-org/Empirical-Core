# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::StudentUpdater do
  subject { described_class.run(student, data) }

  let(:classroom) { create(:classroom, :from_clever) }
  let(:student) { create(:student, :signed_up_with_clever) }

  let(:email) { student.email }
  let(:name) { student.name }
  let(:user_external_id) { student.clever_id }
  let(:username) { student.username }

  let(:data) do
    {
      classroom: classroom,
      email: email,
      name: name,
      user_external_id: user_external_id,
      username: username
    }
  end

  it { expect { subject }.not_to change(student, :clever_id) }
  it { expect { subject }.not_to change(student, :email) }
  it { expect { subject }.not_to change(student, :google_id) }
  it { expect { subject }.not_to change(student, :name) }
  it { expect { subject }.not_to change(student, :username) }

  context 'a different student with username exists' do
    let(:another_student) { create(:student) }
    let(:username) { another_student.username }

    it { expect { subject }.not_to change(student, :username) }

    context 'nil username provided' do
      let(:username) { nil }

      it { expect { subject }.not_to change(student, :username) }
    end
  end

  context 'student has different role' do
    before { student.update(role: User::TEACHER) }

    it { expect { subject }.to change(student, :role).to(User::STUDENT) }
  end

  context 'student has different account_type' do
    before { student.update(account_type: nil) }

    it { expect { subject }.to change(student, :account_type).to(User::CLEVER_ACCOUNT) }
  end

  context 'student also has a google_id' do
    before { student.update(google_id: '12345678') }

    it { expect { subject }.to change { student.reload.google_id }.to(nil) }
    it { expect { subject }.not_to change { student.reload.clever_id } }
  end
end
