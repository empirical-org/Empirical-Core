require 'rails_helper'

describe ConceptSerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { FactoryGirl.create(:concept)}

    let(:expected_serialized_keys) do
      %w(id
         name
         uid
         level
         parent_id
         parent_uid)
    end
  end
end
