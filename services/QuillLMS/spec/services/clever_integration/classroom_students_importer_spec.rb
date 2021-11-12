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
    let(:valid_email) { 'a@b.com' }
    let(:invalid_email) { 'not-an-email' }

    let(:students_data) { [student_data1, student_data2] }

    let(:student_data1) do
      {
        'id' => '123',
        'email' => valid_email,
        'name' => { 'first' => 'Al', 'middle' => 'Ty', 'last' => 'Oz' }
      }
    end

    let(:student_data2) do
      {
        'id' => '456',
        'email' => invalid_email,
        'name' => { 'first' => 'Ky', 'middle' => 'Jo', 'last' => 'Su' }
      }
    end

    it { expect { subject.run }.to change(User.student, :count).from(0).to(2) }
    it { expect { subject.run }.to change(StudentsClassrooms, :count).from(0).to(2) }
    it { expect { subject.run }.to change(CleverClassroomUser, :count).from(0).to(2) }
  end
end
