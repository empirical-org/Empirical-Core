require 'rails_helper'

describe Profile::ActivitySerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:activity) }

    let(:expected_serialized_keys) do
      %w{
        name
        description
        repeatable
        classification
        standard_level
        standard
      }
    end
  end
end
