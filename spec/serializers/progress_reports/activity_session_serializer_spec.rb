require 'rails_helper'

describe ProgressReports::ActivitySessionSerializer, type: :serializer do
  let(:activity_session)   { FactoryGirl.create(:activity_session) }
  let(:serializer) { ProgressReports::ActivitySessionSerializer.new(activity_session) }

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }

    it 'includes the right keys' do
      parsed_session = parsed['activity_session']
      expect(parsed_session.keys)
        .to match_array %w(id 
                            activity_classification_name
                            activity_classification_id
                            activity_name
                            completed_at
                            time_spent
                            percentage
                            )
    end
  end
end
