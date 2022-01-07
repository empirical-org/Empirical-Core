# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomStudentsImporter do
  let(:classroom) { create(:classroom, :from_clever) }

  subject { described_class.run(classroom, students_data) }

  context 'students_data is nil' do
    let(:students_data) { nil }

    it 'skips importing' do
      expect(CleverIntegration::Associators::StudentsToClassroom).not_to receive(:run)
      expect(ProviderClassroomUsersUpdater).not_to receive(:run)
      subject
    end
  end

  context 'students_data is empty' do
    let(:students_data) { [] }

    it 'skips importing' do
      expect(CleverIntegration::Associators::StudentsToClassroom).not_to receive(:run)
      expect(ProviderClassroomUsersUpdater).not_to receive(:run)
      subject
    end
  end

  context 'students_data has two students' do
    let(:students_data) { [student_data1, student_data2] }

    let(:student_data1) do
      {
        clever_id: '123',
        email: 'billo@example.com',
        name: 'Bill Oz',
        username: 'billo'
      }
    end

    let(:student_data2) do
      {
        clever_id: '456',
        email: 'fc@example.com',
        name: 'Frank Clinton',
        username: 'frank_clinton'
      }
    end

    it { expect { subject }.to change(User.student, :count).from(0).to(2) }
    it { expect { subject }.to change(StudentsClassrooms, :count).from(0).to(2) }
    it { expect { subject }.to change(CleverClassroomUser, :count).from(0).to(2) }
  end
end
