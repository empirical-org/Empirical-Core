# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomUpdater do
  let(:clever_id) { '123456' }
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
      let(:data_name) { "Renamed on Quill#{synced_name}" }

      it { expect(subject.name).to eq data_name }
      it { expect(subject.synced_name).to eq data_name }
    end
  end

  context 'custom classroom name' do
    let(:name) { "Renamed on Quill#{synced_name}" }
    let(:synced_name) { 'Clever Classroom' }

    context 'name on Clever has not changed' do
      let(:data_name) { synced_name }

      it { expect(subject.name).to eq name }
      it { expect(subject.synced_name).to eq synced_name }
    end

    context 'name on Clever has changed' do
      let(:data_name) { "renamed on Clever #{synced_name}" }

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

  context "teacher owns another classroom with other_name" do
    let(:other_name) { 'other clever_classroom classroom' }
    let(:classroom1) { create(:classroom, :from_clever, :with_no_teacher, name: other_name) }

    let(:name) { 'clever_classroom classroom'}
    let(:synced_name) { name }
    let(:data_name) { other_name }

    before { create(:classrooms_teacher, user_id: teacher.id, classroom: classroom1) }

    it 'renames a name with duplicate if there is a collision' do
      expect(subject.name).to eq "#{other_name}_1"
    end

    context 'teacher owns other classrooms with names other_name1, ... other_name_[max]' do
      let(:max) { ::DuplicateNameResolver::MAX_BEFORE_RANDOMIZED }

      before do
        2.upto(max) do |n|
          classroom = create(:classroom, :from_clever, :with_no_teacher, name: "#{other_name}_#{n}", grade: grade)
          create(:classrooms_teacher, user_id: teacher.id, classroom: classroom)
        end
      end

      it "stops naming duplicates at max and then starts using random values" do
        expect(subject.name).not_to eq "#{other_name}_11"
        expect(subject.name.starts_with?(other_name)).to be true
      end
    end
  end
end
