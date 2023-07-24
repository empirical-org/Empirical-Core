# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::StudentCreator do
  let(:data) do
    {
      user_external_id: user_external_id,
      email: email,
      name: 'John Smith',
      username: username
    }
  end

  let(:user_external_id) { SecureRandom.hex(12) }
  let(:email) { 'student@gmail.com' }
  let(:username) { 'username' }

  subject { described_class.run(data) }

  it { expect { subject }.to change(User, :count).from(0).to(1) }

  context 'username already exists' do
    before { create(:student, username: username) }

    it { expect(subject.username).not_to eq username }
  end
end
