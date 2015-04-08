require 'rails_helper'

describe ProgressReports::ActivitySessionSerializer, type: :serializer do
  let(:activity_session)   { FactoryGirl.create(:activity_session,
    started_at: started_at,
    completed_at: completed_at,
    percentage: 0.25,
    classroom_activity: classroom_activity)
  }
  let(:classroom) { FactoryGirl.create(:classroom) }
  let(:activity) { FactoryGirl.create(:activity, topic: topic) }
  let(:topic) { FactoryGirl.create(:topic, name: '5.1g. Foobar baz')}
  let(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom, activity: activity) }
  let(:started_at) { Time.zone.local(2015, 1, 1, 12, 15, 0) }
  let(:completed_at) { Time.zone.local(2015, 1, 1, 13, 0, 0) }
  let(:serializer) { ProgressReports::ActivitySessionSerializer.new(activity_session) }

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }
    let(:parsed_session) { parsed['activity_session'] }

    it 'includes the right keys' do
      expect(parsed_session.keys)
        .to match_array %w(id
                            activity_classification_name
                            activity_classification_id
                            activity_name
                            standard
                            completed_at
                            percentage
                            display_score
                            display_completed_at
                            classroom_id
                            unit_id
                            student_name
                            student_id
                            )
    end

    it 'includes fields pre-formatted for display' do
      expect(parsed_session['display_completed_at']).to eq('01/01/2015')
      expect(parsed_session['display_score']).to eq('25%')
      expect(parsed_session['standard']).to eq('5.1g.')
    end

    context 'when the activity session is missing relevant info' do
      let(:activity_session)   { FactoryGirl.create(:activity_session,
          completed_at: nil,
          percentage: nil,
          classroom_activity: classroom_activity,
          time_spent: nil) }
      let(:topic) { nil }

      it 'still works' do
        expect(parsed_session['display_completed_at']).to eq(nil)
        expect(parsed_session['display_score']).to eq('no percentage')
      end
    end
  end
end
