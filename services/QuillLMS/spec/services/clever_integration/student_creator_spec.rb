# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::StudentCreator do
  let(:data) do
    {
      clever_id: clever_id,
      email: email,
      name: 'John Smith',
      username: username
    }
  end

  let(:clever_id) { '1' }
  let(:email) { 'student@gmail.com' }
  let(:username) { 'username' }

  subject { described_class.run(data) }

  it 'will create a new student if none currently exists' do
    expect { subject }.to change(User, :count).from(0).to(1)
  end

  context 'username already exists' do
    before { create(:student, username: username) }

    it 'will create a new student with an updated username' do
      subject
      new_student = ::User.find_by(email: email)

      expect(new_student.username).not_to eq username
    end
  end
end
