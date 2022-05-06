# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::ActivitySessionSerializer, type: :serializer do
  let(:activity_session) do
    create(:activity_session,
      started_at: started_at,
      completed_at: completed_at,
      percentage: 0.25,
    )
  end
  let(:classroom) { create(:classroom) }
  let(:standard) { create(:standard) }
  let(:activity) { create(:activity, standard: standard) }
  let(:started_at) { Time.utc(2015, 1, 1, 12, 15, 0) }
  let(:completed_at) { Time.utc(2015, 1, 1, 13, 0, 0) }
  let(:serializer) do
    ProgressReports::ActivitySessionSerializer.new(activity_session)
  end

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }
    let(:parsed_session) { parsed['activity_session'] }

    it 'includes the right keys' do
      expect(parsed_session.keys).to match_array(
        [
          'id',
          'activity_classification_name',
          'activity_classification_id',
          'activity_name',
          'standard',
          'completed_at',
          'percentage',
          'display_score',
          'display_completed_at',
          'classroom_id',
          'unit_id',
          'student_name',
          'student_id'
        ]
      )
    end

    it 'includes fields pre-formatted for display' do
      expect(parsed_session['display_completed_at']).to eq('01/01/2015')
      expect(parsed_session['display_score']).to eq('25%')
      expect(parsed_session['standard'])
        .to eq(activity_session.activity.standard.try(:name_prefix))
    end

    context 'when the activity session is missing relevant info' do
      let(:activity_session) do
        create(:activity_session,
          completed_at: nil,
          percentage: nil,
          state: 'unstarted'
        )
      end
      let(:standard) { nil }

      it 'still works' do
        expect(parsed_session['display_completed_at']).to eq(nil)
        expect(parsed_session['display_score']).to eq('no percentage')
      end
    end
  end
end
