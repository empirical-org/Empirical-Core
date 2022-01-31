# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherImportedClassroomsUpdater do
  let(:teacher) { create(:teacher, :signed_up_with_clever) }
  let(:teacher_id) { teacher.id }
  let(:data) { { classrooms: classrooms }.to_json }
  let(:owner) { described_class::OWNER }
  let(:coteacher) { described_class::COTEACHER }

  subject { described_class.run(teacher_id) }

  before do
    allow(CleverIntegration::TeacherClassroomsCache).to receive(:read).with(teacher_id).and_return(data)
    allow(CleverIntegration::ImportClassroomStudentsWorker).to receive(:perform_async).with(teacher_id, classroom_ids)
  end

  context 'data has one new classroom' do
    let(:classrooms) { [{ clever_id: 'abcdefgh' }] }
    let(:classroom_ids) { []}

    it { expect { subject }.not_to change(Classroom, :count) }
  end

  context 'data has one already imported classroom with the teacher coteaches' do
    let(:classroom) { create(:classroom, :from_clever, :with_no_teacher).reload }
    let(:updated_name) { "new_#{classroom.name}" }
    let(:classrooms) { [{ clever_id: classroom.clever_id, name: updated_name}] }
    let(:classroom_ids) { [classroom.id] }

    before { create(:classrooms_teacher, user: teacher, classroom: classroom, role: coteacher) }

    it { expect { subject }.not_to change(teacher.classrooms_teachers, :count) }
    it { should_update_the_classroom_synced_name }
  end

  context 'data has one already imported classroom with the teacher owns' do
    let(:classroom) { create(:classroom, :from_clever, :with_no_teacher).reload }
    let(:updated_name) { "new_#{classroom.name}" }
    let(:classrooms) { [{ clever_id: classroom.clever_id, name: updated_name}] }
    let(:classroom_ids) { [classroom.id] }

    before { create(:classrooms_teacher, user: teacher, classroom: classroom, role: owner) }

    it { expect { subject }.not_to change(teacher.classrooms_teachers, :count) }
    it { should_update_the_classroom_synced_name }
  end

  context 'data has one already imported classroom that the teacher has no corresponding ClassroomsTeacher object' do
    let(:classroom) { create(:classroom, :from_clever).reload }
    let(:updated_name) { "new_#{classroom.name}" }
    let(:classrooms) { [{ clever_id: classroom.clever_id, name: updated_name}] }
    let(:classroom_ids) { [classroom.id] }

    it { expect { subject }.to change(teacher.classrooms_teachers, :count).by(1) }
    it { should_update_the_classroom_synced_name }

    context 'the classroom has a corresponding ClassroomsTeacher object with coteacher role' do
      before { classroom.classrooms_teachers.first.update(role: coteacher) }

      it 'assigns owner role to the teacher' do
        subject
        expect(teacher.classrooms_teachers.find_by(classroom: classroom).role).to eq owner
      end
    end

    context 'the classroom has a corresponding ClassroomsTeacher object with owner role' do
      before { classroom.classrooms_teachers.first.update(role: owner) }

      it 'assigns coteacher role to the teacher' do
        subject
        expect(teacher.classrooms_teachers.find_by(classroom: classroom).role).to eq coteacher
      end
    end
  end

  def should_update_the_classroom_synced_name
    expect {
      subject
      classroom.reload
    }.to change(classroom, :synced_name).to(updated_name)
  end
end
