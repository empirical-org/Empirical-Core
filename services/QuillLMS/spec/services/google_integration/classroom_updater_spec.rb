# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomUpdater do
  let(:google_classroom_id) { 123456 }
  let(:teacher_id) { create(:teacher).id }
  let(:grade) { '1' }

  let!(:classroom) do
    create(:classroom,
      :with_no_teacher,
      google_classroom_id: google_classroom_id,
      grade: grade,
      name: name,
      synced_name: synced_name,
      teacher_id: teacher_id
    )
  end

  let(:data) do
    {
      google_classroom_id: google_classroom_id,
      name: data_name,
      grade: '100',
      teacher_id: teacher_id
    }
  end

  before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom) }

  subject { described_class.run(classroom, data) }

  context 'no custom classroom name' do
    let(:name) { 'google_classroom classroom' }
    let(:synced_name) { name }

    context 'name on google_classroom has not changed' do
      let(:data_name) { synced_name }

      it 'no attributes are changed' do
        expect(subject.name).to eq name
        expect(subject.synced_name).to eq synced_name
      end

      it 'updates grade' do
        expect(subject.grade).to_not eq grade
      end
    end

    context 'name on google_classroom changed' do
      let(:data_name) { "Renamed on Quill#{synced_name}" }

      it 'updates name and synced name with data_name' do
        expect(subject.name).to eq data_name
        expect(subject.synced_name).to eq data_name
      end
    end
  end

  context 'custom classroom name' do
    let(:name) { "Renamed on Quill#{synced_name}" }
    let(:synced_name) { 'google_classroom Classroom' }

    context 'name on google_classroom has not changed' do
      let(:data_name) { synced_name }

      it 'no attributes are changed' do
        expect(subject.name).to eq classroom.name
        expect(subject.synced_name).to eq classroom.synced_name
      end
    end

    context 'name on google_classroom has changed' do
      let(:data_name) { "renamed on google_classroom #{synced_name}" }

      it 'updates synced name with data_name' do
        expect(subject.name).to eq name
        expect(subject.synced_name).to eq data_name
      end
    end
  end

  context "teacher owns another classroom with other_name" do
    let(:other_name) { 'other google_classroom classroom' }
    let(:classroom1) { create(:classroom, :from_google, :with_no_teacher, name: other_name) }

    let(:name) { 'google_classroom classroom'}
    let(:synced_name) { name }
    let(:data_name) { other_name }

    before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom1) }

    it 'renames a name with duplicate if there is a collision' do
      expect(subject.name).to eq "#{other_name}_1"
    end

    context 'teacher owns other classrooms with names other_name1, ... other_name_[max]' do
      let(:max) { ::DuplicateNameResolver::MAX_BEFORE_RANDOMIZED }

      before do
        2.upto(max) do |n|
          classroom = create(:classroom, :from_google, :with_no_teacher, name: "#{other_name}_#{n}", grade: grade)
          create(:classrooms_teacher, user_id: teacher_id, classroom: classroom)
        end
      end

      it "stops naming duplicates at max and then starts using random values" do
        expect(subject.name).not_to eq "#{other_name}_11"
        expect(subject.name.starts_with?(other_name)).to be true
      end
    end
  end
end
