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
    let(:password) { last_name }

    let(:data) { { classroom:, email:, first_name:, last_name:, name:, user_external_id: } }

    let(:username) { [[first_name, last_name].join('.').downcase, classroom.code].join('@') }
    let(:account_type) { described_class::ACCOUNT_TYPE }
    let(:role) { described_class::ROLE }
    let(:signed_up_with_google) { described_class::SIGNED_UP_WITH_GOOGLE }

    it { creates_a_student_with_various_attributes }

    context 'nil last name' do
      let(:name) { 'First' }
      let(:first_name) { 'First' }
      let(:last_name) { nil }
      let(:password) { first_name }

      it { creates_a_student_with_various_attributes }
    end

    context 'nil email' do
      let(:email) { nil }

      it { creates_a_student_with_various_attributes }
    end

    def creates_a_student_with_various_attributes
      expect(subject.account_type).to eq account_type
      expect(subject.email).to eq email
      expect(subject.google_id).to eq user_external_id
      expect(subject.name).to eq name
      expect(subject.password).to eq password
      expect(subject.role).to eq role
      expect(subject.signed_up_with_google).to eq signed_up_with_google
      expect(subject.username).to eq username
    end
  end
end
