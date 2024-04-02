# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe TeacherClassroomsStudentsImporter do
    subject { described_class.run(teacher, selected_classroom_ids) }

    let(:teacher) { create(:teacher, :signed_up_with_google) }

    let(:classroom1) { create(:classroom, :from_google, :with_no_teacher) }
    let(:classroom2) { create(:classroom, :from_google, :with_no_teacher) }
    let(:classroom_students_data1) { double('classroom_students_data1') }
    let(:classroom_students_data2) { double('classroom_students_data2') }

    let(:client) { double('client') }

    before do
      allow(ClassroomStudentsData).to receive(:new).with(classroom1, client).and_return(classroom_students_data1)
      allow(ClassroomStudentsData).to receive(:new).with(classroom2, client).and_return(classroom_students_data2)
      allow(ClientFetcher).to receive(:run).with(teacher).and_return(client)
    end

    context 'nil selected_classroom_ids' do
      let(:selected_classroom_ids) { nil }

      before { allow(teacher).to receive(:google_classrooms).and_return([classroom1, classroom2]) }

      it 'runs importer on all of the teachers google_classrooms' do
        expect(ClassroomStudentsImporter).to receive(:run).with(classroom_students_data1)
        expect(ClassroomStudentsImporter).to receive(:run).with(classroom_students_data2)
        subject
      end
    end

    context 'selected_classroom_ids present' do
      let(:selected_classroom_ids) { [classroom2.id] }

      it 'runs importer only on selected_classroom_ids' do
        expect(ClassroomStudentsImporter).to receive(:run).with(classroom_students_data2)
        subject
      end
    end
  end
end
