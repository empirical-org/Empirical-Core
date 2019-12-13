require 'rails_helper'

describe RetrieveGoogleClassroomsWorker, type: :worker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let(:user) { create(:user) }

    it 'run' do
      expect(GoogleIntegration::Classroom::Main).to receive(:pull_data).with(user).and_return({})
      expect(PusherTrigger).to receive(:run)
      subject.perform(user.id)
    end

    it 'should rescue GoogleIntegration::RefreshAccessToken::RefreshAccessTokenError in the Google integration' do
      expect(GoogleIntegration::Classroom::Main).to receive(:pull_data).with(user).and_raise(GoogleIntegration::RefreshAccessToken::RefreshAccessTokenError)
      subject.perform(user.id)
    end

    it 'should rescue GoogleIntegration::Client::AccessTokenError in the Google integration' do
      expect(GoogleIntegration::Classroom::Main).to receive(:pull_data).with(user).and_raise(GoogleIntegration::Client::AccessTokenError)
      subject.perform(user.id)
    end
  end
end
