# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherCreator do
  subject { described_class.run(data) }

  let(:email) { Faker::Internet.email }
  let(:name) { Faker::Name.custom_name }
  let(:user_external_id) { SecureRandom.hex(12) }
  let(:username) { Faker::Internet.user_name }

  let(:data) do
    {
      email: email,
      name: name,
      user_external_id: user_external_id
    }
  end

  before { allow(CleverIntegration::UsernameGenerator).to receive(:run).with(name).and_return(username) }

  it { expect(subject.account_type).to eq described_class::ACCOUNT_TYPE }
  it { expect(subject.clever_id).to eq user_external_id }
  it { expect(subject.email).to eq email }
  it { expect(subject.name).to eq name }
  it { expect(subject.role).to eq described_class::ROLE }
  it { expect(subject.username).to eq username }
end
