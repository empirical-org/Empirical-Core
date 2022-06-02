# frozen_string_literal: true

require 'rails_helper'

describe Admin::TeacherSerializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:teacher) }
    let(:result_key) { "teacher" }

    let(:expected_serialized_keys) do
      %w{
        id
        name
        email
        school
        links
        number_of_students
        number_of_activities_completed
        time_spent
      }
    end
  end
end