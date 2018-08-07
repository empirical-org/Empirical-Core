# require 'rails_helper'
#
# describe CleverStudentImporterWorker do
#   let(:subject) { described_class.new }
#
#   describe '#perform' do
#     let!(:classroom) { create(:classroom) }
#
#     before do
#       allow(CleverIntegration::Importers::Students).to receive(:run) { true }
#       allow(CleverIntegration::Requesters).to receive(:section) { "section" }
#     end
#
#     it 'should run the students importer' do
#       classrooms = Classroom.where(id: classroom.id)
#       expect(CleverIntegration::Importers::Students).to receive(:run).with(classrooms, "token", "section")
#       subject.perform([classroom.id], "token")
#     end
#   end
# end