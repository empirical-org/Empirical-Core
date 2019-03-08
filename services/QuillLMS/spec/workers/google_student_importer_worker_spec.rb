require 'rails_helper'

describe GoogleStudentImporterWorker do
  describe '#perform' do
    let!(:teacher) { create(:teacher, :signed_up_with_google) }
    let(:client) { double(:client, create: true) }
    let(:students_requester) { double(:requester) }

    before do
      allow(GoogleIntegration::Client).to receive(:new) { client }
      allow(GoogleIntegration::Classroom::Requesters::Students).to receive(:generate) { students_requester }
    end

    it 'should run the google student creator and requester' do
      expect(GoogleIntegration::Classroom::Requesters::Students).to receive(:generate).with(true)
      expect(GoogleIntegration::Classroom::Creators::Students).to receive(:run).with(teacher.google_classrooms.to_a, students_requester)
      subject.perform(teacher.id)
    end
  end
end