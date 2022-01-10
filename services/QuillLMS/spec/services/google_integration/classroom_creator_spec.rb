# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomCreator do
  let(:teacher_id) { create(:teacher).id }

  let(:data) do
    {
      google_classroom_id: google_classroom_id,
      name: name,
      teacher_id: teacher_id
    }
  end

  subject { described_class.run(data) }

  let(:google_classroom_id) { 123456 }

  context 'name present' do
    let(:name) { 'google classroom name'}

    it 'creates a new classroom object with synced_name attr initially set to name' do
      expect(ClassroomsTeacher.count).to eq 0
      expect(subject.google_classroom_id).to eq google_classroom_id
      expect(subject.name).to eq name
      expect(subject.synced_name).to eq name
      expect(subject.classrooms_teachers.count).to eq 1
    end
  end

  context 'blank name' do
    let(:name) { nil }

    it 'creates a new classroom object with synced_name attr initially set to name' do
      expect(subject.google_classroom_id).to eq google_classroom_id
      expect(subject.name).to eq "Classroom #{google_classroom_id}"
      expect(subject.synced_name).to eq nil
    end
  end

  context "teacher owns another classroom with same name" do
    let(:name) { 'google classroom name' }
    let(:synced_name) { name }
    let(:name_1) { name }
    let(:classroom_1) { create(:classroom, :from_google, :with_no_teacher, name: name_1) }

    before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom_1) }

    it "renames a classroom object with '_1' appended to new name to avoid a naming collision" do
      expect(subject.name).to eq "#{name}_1"
    end

    context 'and another classroom as same name as a renamed collision' do
      let(:name_2) { "#{name}_1"}
      let(:classroom_2) { create(:classroom, :from_google, :with_no_teacher, name: name_2) }

      before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom_2) }

      it "renames classroom object with '_1_1' appended to new name to avoid two naming collisions" do
        expect(subject.name).to eq "#{name}_1_1"
      end
    end
  end
end
