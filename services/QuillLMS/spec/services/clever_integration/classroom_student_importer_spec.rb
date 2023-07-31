# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::ClassroomStudentImporter do
  subject { described_class.run(data) }

  let(:classroom) { create(:classroom, :from_clever) }
  let(:email) { Faker::Internet.email }
  let(:name) { Faker::Name.custom_name }
  let(:user_external_id) { SecureRandom.hex(12) }
  let(:username) { Faker::Internet.username }

  let(:data) do
    {
      classroom: classroom,
      email: email,
      name: name,
      user_external_id: user_external_id,
      username: username
    }
  end

  context 'student with email exists' do
    before { create(:student, :signed_up_with_clever, email: email) }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.to change(StudentsClassrooms, :count).by(1) }
  end

  context 'student with user_external_id exists' do
    before { create(:student, :signed_up_with_clever, clever_id: user_external_id) }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.to change(StudentsClassrooms, :count).by(1) }
  end

  context 'student with username exists' do
    before { create(:student, :signed_up_with_clever, username: username) }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.to change(StudentsClassrooms, :count).by(1) }
  end

  context 'nil username is passed as data' do
    let(:username) { nil }

    it { expect { subject }.to change(User.student, :count).by(1) }
    it { expect { subject }.to change(StudentsClassrooms, :count).by(1) }
  end
end
