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

    it 'should rescue ArgumentError in the Google integration' do
      expect(GoogleIntegration::Classroom::Main).to receive(:pull_data).with(user).and_raise(ArgumentError)
      subject.perform(user.id)
    end
  end
end
