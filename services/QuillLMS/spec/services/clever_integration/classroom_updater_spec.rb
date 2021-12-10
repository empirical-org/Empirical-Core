# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomUpdater do
  let(:clever_id) { '123_456' }
  let(:grade) { 'Kindergarten' }
  let(:data_grade) { '1' }
  let(:teacher) { create(:teacher) }

  let!(:classroom) do
    create(:classroom,
      clever_id: clever_id,
      grade: grade,
      name: name,
      synced_name: synced_name
    )
  end

  let(:data) do
    {
      clever_id: clever_id,
      grade: data_grade,
      name: data_name,
      teacher_id: teacher.id
    }
  end

  subject { described_class.run(classroom, data) }

  context 'no custom classroom name' do
    let(:name) { 'clever classroom' }
    let(:synced_name) { name }

    context 'name on Clever has not changed' do
      let(:data_name) { synced_name }

      it { expect(subject.name).to eq name }
      it { expect(subject.synced_name).to eq synced_name }
      it { expect(subject.grade).to_not eq grade }

    end

    context 'name on Clever changed' do
      let(:data_name) { 'Renamed on Quill' + synced_name }

      it { expect(subject.name).to eq data_name }
      it { expect(subject.synced_name).to eq data_name }
    end
  end

  context 'custom classroom name' do
    let(:name) { 'Renamed on Quill' + synced_name }
    let(:synced_name) { 'Clever Classroom' }

    context 'name on Clever has not changed' do
      let(:data_name) { synced_name }

      it { expect(subject.name).to eq name }
      it { expect(subject.synced_name).to eq synced_name }
    end

    context 'name on Clever has changed' do
      let(:data_name) { 'renamed on Clever ' + synced_name }

      it { expect(subject.name).to eq name }
      it { expect(subject.synced_name).to eq data_name }
    end
  end

  context 'classrooms_teacher associations' do
    let(:name) { 'clever classroom' }
    let(:synced_name) { name }
    let(:data_name) { synced_name }

    before { ClassroomsTeacher.where(classroom: classroom).delete_all }

    context 'classroom has no owner or coteachers' do
      it  { expect(subject.owner).to eq teacher }
    end

    context 'teacher owns classroom' do
      before { create(:classrooms_teacher, classroom: classroom, user: teacher) }

      it  { expect(subject.owner).to eq teacher }
    end

    context 'another teacher owns classroom' do
      before { create(:classrooms_teacher, classroom: classroom) }

      it { expect(subject.coteachers.first).to eq teacher }
    end

    context 'teacher is coteacher but no owner exists' do
      before { create(:coteacher_classrooms_teacher, classroom: classroom, user: teacher) }

      it { expect(subject.coteachers.first).to eq teacher }
      it { expect(subject.owner).to_not eq teacher }
    end
  end
end
