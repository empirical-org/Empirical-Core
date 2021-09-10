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

  subject { described_class.new(data) }

  let(:classroom) { subject.run }

  let(:google_classroom_id) { 123456 }

  context 'name present' do
    let(:name) { 'google classroom name'}

    it 'creates a new classroom object with synced_name attr initially set to name' do
      expect(ClassroomsTeacher.count).to eq 0
      expect(classroom.google_classroom_id).to eq google_classroom_id
      expect(classroom.name).to eq name
      expect(classroom.synced_name).to eq name
      expect(classroom.classrooms_teachers.count).to eq 1
    end
  end

  context 'blank name' do
    let(:name) { nil }

    it 'creates a new classroom object with synced_name attr initially set to name' do
      expect(classroom.google_classroom_id).to eq google_classroom_id
      expect(classroom.name).to eq "Classroom #{google_classroom_id}"
      expect(classroom.synced_name).to eq nil
    end
  end

  context "teacher owns another classroom with same name" do
    let(:name) { 'google classroom name' }
    let(:synced_name) { name }
    let(:name_1) { name }
    let(:classroom_1) { create(:classroom, :from_google, :with_no_teacher, name: name_1) }

    before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom_1) }

    it 'creates a new classroom object with new name to avoid a naming collision' do
      expect(classroom.name).to eq "#{name}_1"
    end

    context 'and another classroom as same name as a renamed collision' do
      let(:name_2) { "#{name}_1"}
      let(:classroom_2) { create(:classroom, :from_google, :with_no_teacher, name: name_2) }

      before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom_2) }

      it 'creates a new classroom object with new name to avoid two naming collisions' do
        expect(classroom.name).to eq "#{name}_1_1"
      end
    end
  end
end
