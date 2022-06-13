# frozen_string_literal: true

require 'rails_helper'

describe Cms::ActivitySerializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:activity) }
    let(:result_key) { "activity" }

    let(:expected_serialized_keys) do
      %w{
        uid
        id
        name
        description
        flags
        data
        created_at
        updated_at
        supporting_info
        activity_category
        readability_grade_level
        unit_template_names
        classification
      }
    end
  end
end
