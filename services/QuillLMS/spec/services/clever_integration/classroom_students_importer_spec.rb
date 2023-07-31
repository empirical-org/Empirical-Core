# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomStudentsImporter do
  include_context 'Clever Library Students Data'

  let(:classroom) { create(:classroom, :from_clever) }
  let(:classroom_external_id) { classroom.classroom_external_id }
  let(:classroom_students_data) { CleverIntegration::ClassroomStudentsData.new(classroom, client) }
  let(:client) { double(:clever_client) }

  before { allow(client).to receive(:classroom_students).with(classroom_external_id).and_return(students_data) }

  subject { described_class.run(classroom_students_data) }

  context 'classroom_students_data is nil' do
    let(:students_data) { nil }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.not_to change(StudentsClassrooms, :count) }
    it { expect { subject }.not_to change(CleverClassroomUser, :count) }
  end

  context 'classroom_students_data is empty' do
    let(:students_data) { [] }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.not_to change(StudentsClassrooms, :count) }
    it { expect { subject }.not_to change(CleverClassroomUser, :count) }
  end

  context 'classroom_students_data has two students' do
    let(:students_data) { [student1_attrs, student2_attrs] }

    it { expect { subject }.to change(User.student, :count).from(0).to(2) }
    it { expect { subject }.to change(StudentsClassrooms, :count).from(0).to(2) }
    it { expect { subject }.to change(CleverClassroomUser, :count).from(0).to(2) }
  end
end
