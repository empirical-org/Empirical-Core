# frozen_string_literal: true

require 'rails_helper'

describe UserAdminSerializer do
  it_behaves_like 'serializer' do
    let!(:record_instance) { create(:teacher_with_school, :premium)}
    let(:result_key) { "user_admin" }
    let!(:school) { create(:school) }
    let!(:student) { create(:student) }
    let!(:school_users) { create(:schools_users, school: school, user: student) }
    let!(:schools_admins) { create(:schools_admins, school: school, user: record_instance) }

    let(:expected_serialized_keys) do
      %w{
        associated_school
        id
        name
        email
        teachers
        schools
      }
    end
  end

  describe 'when there are no schools_users and only the existing schools admin' do
    let!(:record_instance) { create(:teacher_with_school, :premium)}
    let(:result_key) { "user_admin" }
    let!(:school) { create(:school) }
    let!(:schools_admins) { create(:schools_admins, school: school, user: record_instance) }

    it 'the #teachers method returns an empty array' do
      expect(UserAdminSerializer.new(record_instance).teachers.length).to be 1
    end
  end
end
