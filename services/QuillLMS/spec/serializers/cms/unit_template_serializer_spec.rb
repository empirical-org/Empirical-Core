# frozen_string_literal: true

require 'rails_helper'

describe Cms::UnitTemplateSerializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:unit_template) }
    let(:result_key) { "unit_template" }

    let(:expected_serialized_keys) do
      %w{
        activities
        id
        name
        author_id
        time
        unit_template_category_id
        grades
        flag
        order_number
        activity_info
        image_link
        readability
        diagnostic_names
        unit_template_category
      }
    end
  end
end
