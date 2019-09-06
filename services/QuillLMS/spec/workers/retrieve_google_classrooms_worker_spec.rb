require 'rails_helper'

describe RetrieveGoogleClassroomsWorker, type: :worker do
  let(:subject) { described_class.new }
  let(:analyzer) { double(:analyzer, track_with_attributes: true, track: true) }

  describe '#perform' do
    let(:user) { create(:user) }

    before do
      expect(GoogleIntegration::Classroom::Main).to receive(:pull_data).with(user).and_return({})
      expect(PusherTrigger).to receive(:run)
    end

    it 'run' do
      subject.perform(user.id)
    end
  end
end
