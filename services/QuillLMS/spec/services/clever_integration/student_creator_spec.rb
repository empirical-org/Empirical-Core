require 'rails_helper'

describe CleverIntegration::StudentCreator do
  let(:data) {
    {
      clever_id: '1',
      email: 'student@gmail.com',
      name: 'John Smith',
      username: 'username'
    }
  }

  subject { described_class.new(data) }

  it 'will create a new student if none currently exists' do
    expect { subject.run }.to change(User, :count).from(0).to(1)
  end
end
