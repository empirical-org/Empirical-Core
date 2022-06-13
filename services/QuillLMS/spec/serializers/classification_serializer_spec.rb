# frozen_string_literal: true

require 'rails_helper'

describe ClassificationSerializer, type: :serializer do
  [1, 2, 4, 5, 6, 7].each do |app_id|
    it_behaves_like 'serializer' do
      let(:record_instance) { create(:classification, id: app_id) }
      let(:result_key) { 'classification' }

      let(:expected_serialized_keys) do
        %w(uid
           id
           name
           key
           form_url
           module_url
           created_at
           updated_at
           green_image_class
           alias
           scorebook_icon_class)
      end
    end
  end
end
