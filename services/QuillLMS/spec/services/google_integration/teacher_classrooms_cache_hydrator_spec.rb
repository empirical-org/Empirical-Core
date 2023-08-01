# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::TeacherClassroomsCacheHydrator do
  subject { described_class.run(user) }

  let(:user) { create(:user) }

  it 'should trigger a pusher notification when now errors are raised' do
    expect(GoogleIntegration::Classroom::Main)
      .to receive(:pull_data)
      .with(user)
      .and_return({})

    expect(PusherTrigger).to receive(:run)
    subject
  end

  it 'should rescue GoogleIntegration::RefreshAccessToken::RefreshAccessTokenError in the Google integration' do
    expect(GoogleIntegration::Classroom::Main)
      .to receive(:pull_data)
      .with(user)
      .and_raise(GoogleIntegration::RefreshAccessToken::RefreshAccessTokenError)

    subject
  end

  it 'should rescue GoogleIntegration::Client::AccessTokenError in the Google integration' do
    expect(GoogleIntegration::Classroom::Main)
      .to receive(:pull_data)
      .with(user)
      .and_raise(GoogleIntegration::Client::AccessTokenError)

    subject
  end
end
