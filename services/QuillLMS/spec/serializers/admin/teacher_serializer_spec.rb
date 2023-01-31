# frozen_string_literal: true

require 'rails_helper'

describe Admin::TeacherSerializer do
  it_behaves_like 'serializer' do
    let!(:teacher) { create(:teacher) }
    let(:record_instance) { TeachersData.run([teacher.id])[0] }
    let(:result_key) { "teacher" }

    let(:expected_serialized_keys) do
      %w{
        id
        name
        email
        last_sign_in
        schools
        number_of_students
        number_of_activities_completed
        time_spent
        has_valid_subscription
      }
    end
  end

  describe 'serializer properties' do
    let!(:school1) { create(:school) }
    let!(:school2) { create(:school) }
    let!(:teacher) { create(:teacher) }

    subject { described_class.new(teacher) }

    it 'returns the expected "schools" payload' do
       create(:schools_users, user: teacher, school: school2)
       create(:schools_admins, user: teacher, school: school2)
       create(:schools_admins, user: teacher, school: school1)
       teacher.reload

       expect(subject.schools).to eq([
        { name: school2.name, id: school2.id, role: 'Admin' },
        { name: school1.name, id: school1.id, role: 'Admin' }
       ])
    end
    # TODO: add tests for remaining properties
  end
end
