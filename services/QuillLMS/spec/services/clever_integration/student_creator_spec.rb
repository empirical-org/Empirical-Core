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

  let(:email) { 'student@gmail.com' }
  let(:username) { 'username' }

  subject { described_class.new(data) }

  it 'will create a new student if none currently exists' do
    expect { subject.run }.to change(User, :count).from(0).to(1)
  end

  context 'username already exists' do
    before { create(:student) { create(:student, username: username)} }

    it 'will create a new student with an updated username' do
      subject.run

      expect(User.find_by(email: email).username).not_to eq username
    end
  end
end
