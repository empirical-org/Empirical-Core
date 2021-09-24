require 'rails_helper'

describe CleverLibraryStudentImporterWorker do
  describe '#perform' do
    let(:token) { double('token') }
    let(:classroom_ids) { [123, 456] }
    let(:client) { double('client') }
    let(:importer) { double('importer', run: nil) }

    before { allow(CleverLibrary::Api::Client).to receive(:new).with(token).and_return(client) }

    it 'should run importing with valid teacher id and no selected_classroom_ids' do
      expect(CleverIntegration::LibraryStudentImporter).to receive(:new).with(classroom_ids, client).and_return(importer)

      subject.perform(classroom_ids, token)
    end
  end
end
