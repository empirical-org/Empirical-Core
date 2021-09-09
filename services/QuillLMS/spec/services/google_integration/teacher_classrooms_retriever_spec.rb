require 'rails_helper'

describe GoogleIntegration::TeacherClassroomsRetriever do
  let(:user) { create(:user) }

  subject { described_class.new(user.id) }

  it 'should trigger a pusher notification when now errors are raised' do
    expect(GoogleIntegration::Classroom::Main)
      .to receive(:pull_data)
      .with(user)
      .and_return({})

    expect(PusherTrigger).to receive(:run)
    subject.run
  end

  it 'should rescue GoogleIntegration::RefreshAccessToken::RefreshAccessTokenError in the Google integration' do
    expect(GoogleIntegration::Classroom::Main)
      .to receive(:pull_data)
      .with(user)
      .and_raise(GoogleIntegration::RefreshAccessToken::RefreshAccessTokenError)

    subject.run
  end

  it 'should rescue GoogleIntegration::Client::AccessTokenError in the Google integration' do
    expect(GoogleIntegration::Classroom::Main)
      .to receive(:pull_data)
      .with(user)
      .and_raise(GoogleIntegration::Client::AccessTokenError)

    subject.run
  end
end
