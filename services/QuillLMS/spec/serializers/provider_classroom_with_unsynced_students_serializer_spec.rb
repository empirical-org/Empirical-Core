# frozen_string_literal: true

require 'rails_helper'

describe ProviderClassroomWithUnsyncedStudentsSerializer, type: :serializer do
  subject { described_class.new(provider_classroom) }

  let(:classroom) { create(:classroom, :from_google, students: [student1, student2]) }
  let(:provider_classroom) { ProviderClassroomDelegator.new(classroom) }
  let(:student1) { create(:student, :signed_up_with_google) }
  let(:student2) { create(:student, :signed_up_with_google) }

  let!(:synced_student) do
    create(:google_classroom_user,
      :active,
      classroom_external_id: classroom.classroom_external_id,
      user_external_id: student1.google_id
    )
  end

  let!(:unsynced_student) do
    create(:google_classroom_user,
      :deleted,
      classroom_external_id: classroom.classroom_external_id,
      user_external_id: student2.google_id
    )
  end

  let(:results) { subject.as_json }

  it 'serializes' do
    expect(results).to eq(
      {
        id: classroom.id,
        name: classroom.name,
        code: classroom.code,
        unsynced_students: [
          {
            id: student2.id,
            email: student2.email,
            name: student2.name
          }
        ]
      }
    )
  end
end
