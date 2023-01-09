# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherClassroomsStudentsImporter do
  let(:clever_classroom) { create(:classroom, :from_clever) }
  let(:teacher) { clever_classroom.owner }

  let(:non_clever_classroom) do
    create(:classrooms_teacher, classroom: create(:classroom, :with_no_teacher), user: teacher).classroom
  end

  let(:classroom_ids) { [clever_classroom.id, non_clever_classroom.id] }

  subject { described_class.run(teacher, classroom_ids) }

  let(:client) { double(:clever_client) }
  let(:students_data) { double(:students_data) }

  it 'runs the importer only on clever classrooms' do
    expect(CleverIntegration::ClientFetcher).to receive(:run).with(teacher).and_return(client)
    expect(client).to receive(:get_classroom_students).with(clever_classroom.clever_id).and_return(students_data)
    expect(CleverIntegration::ClassroomStudentsImporter).to receive(:run).with(clever_classroom, students_data, teacher.id)
    subject
  end
end
