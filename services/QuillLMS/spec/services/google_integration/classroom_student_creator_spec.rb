# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomStudentCreator do
  let(:email) { 'first_user@gmail.com' }
  let(:google_id) { '123' }
  let(:name) { 'First User' }
  let(:first_name) { 'First' }
  let(:last_name) { 'User' }
  let(:classroom) { double(:classroom, code: 'classroom-code') }

  let(:data) do
    {
      email: email,
      google_id: google_id,
      name: name,
      first_name: first_name,
      last_name: last_name,
      classroom: classroom
    }
  end

  subject { described_class.new(data) }

  let!(:student) { subject.run }

  let(:username) { [[first_name, last_name].join('.').downcase, classroom.code].join('@') }
  let(:account_type) { described_class::ACCOUNT_TYPE }
  let(:role) { described_class::ROLE }
  let(:signed_up_with_google) { described_class::SIGNED_UP_WITH_GOOGLE }

  it 'creates a new student with various attributes' do
    expect(student.account_type).to eq account_type
    expect(student.email).to eq email
    expect(student.google_id).to eq google_id
    expect(student.name).to eq name
    expect(student.password).to eq last_name
    expect(student.role).to eq role
    expect(student.signed_up_with_google).to eq signed_up_with_google
    expect(student.username).to eq username
  end

  context 'nil last name' do
    let(:name) { 'First' }
    let(:first_name) { 'First' }
    let(:last_name) { nil }

    it 'creates a new student with various attributes' do
      expect(student.account_type).to eq account_type
      expect(student.email).to eq email
      expect(student.google_id).to eq google_id
      expect(student.name).to eq name
      expect(student.password).to eq first_name
      expect(student.role).to eq role
      expect(student.signed_up_with_google).to eq signed_up_with_google
      expect(student.username).to eq username
    end
  end
end
