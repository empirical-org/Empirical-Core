# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::LibraryTeacherIntegration do
  let!(:teacher) { classroom1.owner }
  let(:token) { "ila49754462" }
  let(:provider) { AuthCredential::CLEVER_LIBRARY_PROVIDER }

  let(:classroom1) { create(:classroom, :from_clever, students: [student1]) }

  let(:student1) { create(:student, :signed_up_with_clever) }

  subject { described_class.run(teacher, token) }

  it do
    expect(CleverIntegration::AuthCredentialSaver).to receive(:run).with(teacher, token, provider)
    subject
  end
end
