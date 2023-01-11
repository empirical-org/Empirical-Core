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
end
