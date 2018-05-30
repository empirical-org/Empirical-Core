require 'rails_helper'

describe ClassificationSerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:classification) }
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
