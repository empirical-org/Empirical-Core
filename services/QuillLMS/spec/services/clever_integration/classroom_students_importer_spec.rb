require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomStudentsImporter do
  let(:classroom) { create(:classroom, :from_clever) }

  subject { described_class.new(classroom, students_data) }

  context 'students_data is nil' do
    let(:students_data) { nil }

    it 'skips importing' do
      expect(subject).not_to receive(:associate_students_with_classroom)
      expect(subject).not_to receive(:associate_students_with_provider_classroom)
      subject.run
    end
  end

  context 'students_data is empty' do
    let(:students_data) { [] }

    it 'skips importing' do
      expect(subject).not_to receive(:associate_students_with_classroom)
      expect(subject).not_to receive(:associate_students_with_provider_classroom)
      subject.run
    end
  end

  context 'students_data has two students' do
    let(:students_data) { [student_data1, student_data2] }

    let(:student_data1) { { 'id' => '123', 'name' => { 'first' => 'Al', 'middle' => 'Ty', 'last' => 'Oz'} } }
    let(:student_data2) { { 'id' => '456', 'name' => { 'first' => 'Ky', 'middle' => 'Jo', 'last' => 'Su'} } }

    it { expect { subject.run }.to change(User.student, :count).from(0).to(2) }
    it { expect { subject.run }.to change(StudentsClassrooms, :count).from(0).to(2) }
    it { expect { subject.run }.to change(CleverClassroomUser, :count).from(0).to(2) }
  end
end
