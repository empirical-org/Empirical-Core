# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomStudentsImporter do
  let(:classroom) { create(:classroom, :from_google) }

  let(:classroom_students_data) { GoogleIntegration::ClassroomStudentsData.new(classroom, classroom_students_client) }
  let(:classroom_students_client) { double('classroom_students_client') }

  before { allow(classroom_students_data).to receive(:students_data).and_return(students_data) }

  subject { described_class.run(classroom_students_data) }

  context "no student data imported" do
    let(:students_data) { [] }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.not_to change(GoogleClassroomUser, :count) }
  end

  context "existing student and one new student" do
    let(:student) { create(:student, :signed_up_with_google) }
    let(:google_id) { student.google_id }
    let(:google_classroom_id) { classroom.google_classroom_id }

    before { create(:google_classroom_user, provider_classroom_id: google_classroom_id, provider_user_id: google_id) }

    let(:students_data) do
      [
        { name: 'Test1_s1 S1', email: 'test1_s1@gmail.com', google_id: '123' },
        { name: student.name, email: student.email, google_id: google_id }
      ]
    end

    it { expect { subject }.to change(User.student, :count).from(1).to(2) }
    it { expect { subject }.to change(GoogleClassroomUser, :count).from(1).to(2) }
  end

  context "two new students" do
    let(:students_data) do
      [
        { name: 'Test1_s1 S1', email: 'test1_s1@gmail.com', google_id: '123' },
        { name: 'Test1_s2 S2', email: 'test1_s2@gmail.com', google_id: '456' }
      ]
    end

    it { expect { subject }.to change(User.student, :count).from(0).to(2) }
    it { expect { subject }.to change(GoogleClassroomUser, :count).from(0).to(2) }
  end
end
