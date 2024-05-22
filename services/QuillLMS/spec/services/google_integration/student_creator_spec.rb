# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe StudentCreator do
    subject { described_class.run(data) }

    let(:email) { 'first_user@gmail.com' }
    let(:user_external_id) { Faker::Number.number(digits: 21).to_s }
    let(:name) { 'First User' }
    let(:first_name) { 'First' }
    let(:last_name) { 'User' }
    let(:classroom) { double(:classroom, code: 'classroom-code') }

    let(:data) do
      {
        classroom: classroom,
        email: email,
        first_name: first_name,
        last_name: last_name,
        name: name,
        user_external_id: user_external_id,
      }
    end

    let(:username) { [[first_name, last_name].join('.').downcase, classroom.code].join('@') }
    let(:account_type) { described_class::ACCOUNT_TYPE }
    let(:role) { described_class::ROLE }
    let(:signed_up_with_google) { described_class::SIGNED_UP_WITH_GOOGLE }

    it { expect(subject.account_type).to eq account_type }
    it { expect(subject.email).to eq email }
    it { expect(subject.google_id).to eq user_external_id }
    it { expect(subject.name).to eq name }
    it { expect(subject.password).to eq last_name }
    it { expect(subject.role).to eq role }
    it { expect(subject.signed_up_with_google).to eq signed_up_with_google }
    it { expect(subject.username).to eq username }

    context 'nil last name' do
      let(:name) { 'First' }
      let(:first_name) { 'First' }
      let(:last_name) { nil }

      it 'creates a new subject.with various attributes' do
        expect(subject.account_type).to eq account_type
        expect(subject.email).to eq email
        expect(subject.google_id).to eq user_external_id
        expect(subject.name).to eq name
        expect(subject.password).to eq first_name
        expect(subject.role).to eq role
        expect(subject.signed_up_with_google).to eq signed_up_with_google
        expect(subject.username).to eq username
      end
    end
  end
end
