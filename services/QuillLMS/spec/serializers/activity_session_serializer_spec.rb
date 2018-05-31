require 'rails_helper'

describe ActivitySessionSerializer, type: :serializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:activity_session)}
    let(:concept)         { create(:concept) }

    let(:expected_serialized_keys) do
      %w(activity_uid
         anonymous
         completed_at
         data
         percentage
         state
         temporary
         uid)
    end
  end
end
