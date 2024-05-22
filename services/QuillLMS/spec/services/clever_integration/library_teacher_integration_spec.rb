# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::LibraryTeacherIntegration do
  let(:teacher) { classroom.owner }
  let(:token) { "il#{SecureRandom.hex(19)}" }
  let(:auth_credential_class) { CleverLibraryAuthCredential }
  let(:classroom) { create(:classroom, :from_clever, students: [student]) }
  let(:student) { create(:student, :signed_up_with_clever) }

  subject { described_class.run(teacher, token) }

  it do
    expect(CleverIntegration::AuthCredentialSaver)
      .to receive(:run)
      .with(
        access_token: token,
        auth_credential_class: auth_credential_class,
        user: teacher
      )

    subject
  end
end
