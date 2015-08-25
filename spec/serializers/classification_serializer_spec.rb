require 'rails_helper'

describe ClassificationSerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { FactoryGirl.create(:classification) }
    let(:result_key) { 'classification' }

    let(:expected_serialized_keys) do
      %w(alias
         created_at
         form_url
         id
         image_class
         key
         module_url
         name
         scorebook_icon_class
         uid
         updated_at)
    end
  end
end
