# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomStudentUpdater do
  let(:email) { 'first_user@gmail.com' }

  let(:google_id) { '123' }
  let(:data) { { email: email, google_id: google_id } }
  let(:account_type) { described_class::ACCOUNT_TYPE }
  let(:role) { described_class::ROLE }

  subject { described_class.run(student, data) }

  context 'student has role student' do
    let(:student) { create(:student, email: email )}

    it { updates_student_attributes }
    it { expect { subject }.not_to change(ChangeLog, :count) }
  end

  context 'student has role teacher' do
    let(:student) { create(:teacher, email: email )}

    it { updates_student_attributes }
    it { expect { subject }.to change(ChangeLog, :count).by(1) }
  end

  def updates_student_attributes
    subject
    student.reload

    expect(student.email).to eq email
    expect(student.role).to eq role
    expect(student.account_type).to eq account_type
    expect(student.google_id).to eq google_id
  end
end
