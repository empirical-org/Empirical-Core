require 'rails_helper'

describe CleverIntegration::StudentCreator do
  let(:data) do
    {
      clever_id: '1',
      email: email,
      name: 'John Smith',
      username: username
    }
  end

  let(:email) { 'Student@gmail.com' }
  let(:username) { 'Username' }

  subject { described_class.new(data) }

  it 'will create a new student if none currently exists' do
    expect { subject.run }.to change(User, :count).from(0).to(1)
  end

  context 'username already exists' do
    before { create(:student, username: username) }

    it 'will create a new student with an updated username' do
      subject.run
      new_student = ::User.find_by(email: email.downcase)

      expect(new_student.username).not_to eq username
    end
  end
end
