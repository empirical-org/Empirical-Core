# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomStudentImporter do
  let(:name) { 'The Student'}
  let(:google_id) { '123' }
  let(:classroom) { create(:classroom, :from_google) }

  let(:data) do
    {
      classroom: classroom,
      email: email,
      google_id: google_id,
      name: name
    }
  end

  subject { described_class.run(data) }

  context 'no email given' do
    let(:email) { nil }
    let(:importer) { described_class.new(data) }

    it 'does not run import' do
      expect(importer).not_to receive(:update_student_with_google_id_and_different_email)
      importer.run
    end
  end

  context 'email given' do
    let(:email) { 'student@gmail.com' }

    it 'associates students to classrooms' do
      expect { subject }.to change(StudentsClassrooms, :count).from(0).to(1)
    end

    context 'user exists with email' do
      context 'with role student' do
        before { create(:student, email: email) }

        it { expect { subject }.to_not change(User.student, :count) }
      end

      context 'role is teacher' do
        let!(:student) { create(:teacher, email: email) }

        context 'teacher has classrooms' do
          before { create(:classrooms_teacher, user: student) }

          it { expect { subject }.to_not change(User.student, :count) }
          it { expect { subject }.to change(ChangeLog, :count).by(1) }
        end

        context 'teacher has no classrooms' do
          it { expect { subject }.to change(User.student, :count).by(1) }
        end
      end
    end

    context 'no user exists with email' do
      context 'student exists with google_id' do
        let(:another_email) { "another_#{email}" }

        before { create(:student, email: another_email, google_id: google_id) }

        it 'updates the students email first then calls updater' do
          expect { subject }.to_not change(User.student, :count)
        end
      end

      context 'no student exists with google_id' do
        it 'creates a new student' do
          expect { subject }.to change(User.student, :count).from(0).to(1)
        end
      end
    end
  end
end
