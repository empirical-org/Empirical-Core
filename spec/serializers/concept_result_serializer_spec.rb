require 'rails_helper'

describe ConceptResultSerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { FactoryGirl.create(:concept_result, metadata: {correct: 1})}

    let(:expected_serialized_keys) do
      %w(concept_name
         metadata)
    end
  end
end
