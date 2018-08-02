require 'rails_helper'

describe Profile::StudentActivitySerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:activity) }
    let(:result_key) { "student_activity" }

    let(:expected_serialized_keys) do
      %w{
        name
        description
        repeatable
        activity_classification_id
      }
    end
  end
end
