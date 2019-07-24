require 'rails_helper'

describe Profile::ActivitySessionSerializer do
  it_behaves_like 'serializer' do
    let(:record_instance) { create(:activity_session) }

    let(:expected_serialized_keys) do
      %w{
          id
          percentage
          link
          due_date_or_completed_at_date
          due_date
          state
          activity
        }
    end
  end
end