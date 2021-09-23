require 'rails_helper'

RSpec.describe CleverIntegration::LibraryStudentImporter do
  let(:classroom1) { create(:classroom, :from_clever) }
  let(:classroom2) { create(:classroom) }
  let(:classroom_ids) { [classroom1.id, classroom2.id] }

  let(:client) { double('clever_client') }
  let(:importer) { double('classroom_students_importer', run: nil) }

  subject { described_class.new(classroom_ids, client) }

  before { allow(client).to receive(:get_section_students).with(section_id: classroom1.clever_id) }

  before { allow(CleverIntegration::ClassroomStudentsImporter).to receive(:new).and_return(importer) }

  it 'runs the importer only on clever classrooms' do
    expect(CleverIntegration::ClassroomStudentsImporter).to receive(:new).once
    subject.run
  end
end
