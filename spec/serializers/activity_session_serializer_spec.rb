require 'rails_helper'

describe ActivitySessionSerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { FactoryGirl.create(:activity_session, concept_results: [concept_result])}
    let(:concept_result)  { FactoryGirl.create(:concept_result, metadata: {foo: 'bar'}, concept: concept) }
    let(:concept)         { FactoryGirl.create(:concept) }

    let(:expected_serialized_keys) do
      %w(activity_uid
         anonymous
         completed_at
         concept_results
         data
         percentage
         state
         temporary
         uid)
    end

    let(:nested_array_keys) do
      %w(concept_results)
    end
  end
end
