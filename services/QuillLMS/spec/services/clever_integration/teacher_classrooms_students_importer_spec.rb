# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherClassroomsStudentsImporter do
  subject { described_class.run(teacher, classroom_ids) }

  let(:clever_classroom) { create(:classroom, :from_clever) }
  let(:teacher) { clever_classroom.owner }

  let(:non_clever_classroom) do
    create(:classrooms_teacher, classroom: create(:classroom, :with_no_teacher), user: teacher).classroom
  end

  let(:classroom_ids) { [clever_classroom.id, non_clever_classroom.id] }

  let(:client) { double(:clever_client) }
  let(:classroom_students_data) { double(:classroom_students_data) }

  before do
    allow(CleverIntegration::ClassroomStudentsData)
      .to receive(:new)
      .with(clever_classroom, client)
      .and_return(classroom_students_data)
  end

  it 'runs the importer only on clever classrooms' do
    expect(CleverIntegration::ClientFetcher)
      .to receive(:run)
      .with(teacher)
      .and_return(client)

    expect(CleverIntegration::ClassroomStudentsImporter)
      .to receive(:run)
      .with(classroom_students_data)

    subject
  end
end
