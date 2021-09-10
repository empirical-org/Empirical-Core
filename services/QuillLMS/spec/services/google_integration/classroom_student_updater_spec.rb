require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomStudentUpdater do
  let(:email) { 'first_user@gmail.com' }
  let!(:student) { create(:student, email: email )}

  let(:google_id) { '123' }
  let(:data) { { email: email, google_id: google_id } }

  subject { described_class.new(data) }

  let!(:updated_student) { subject.run }

  let(:account_type) { described_class::ACCOUNT_TYPE }

  it "updates an existing student's account_type and google_id" do
    expect(updated_student.email).to eq student.email
    expect(updated_student.role).to eq student.role
    expect(updated_student.account_type).to eq account_type
    expect(updated_student.google_id).to eq google_id
  end
end
