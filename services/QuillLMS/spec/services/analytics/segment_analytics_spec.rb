require 'rails_helper'

describe 'SegmentAnalytics' do

  # TODO : arent tests of these behaviours duplicated in the tests of the Workers?

  let(:analytics) { SegmentAnalytics.new }

  let(:track_calls) { analytics.backend.track_calls }
  let(:identify_calls) { analytics.backend.identify_calls }


  context 'tracking classroom creation' do
    let(:classroom) { create(:classroom) }

    it 'sends an event' do
      analytics.track_classroom_creation(classroom)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::CLASSROOM_CREATION)
      expect(track_calls[0][:user_id]).to eq(classroom.owner.id)
    end
  end

  context 'tracking activity assignment' do
    let(:teacher) { create(:teacher) }
    let(:activity) { create(:diagnostic_activity) }

    it 'sends an event with information about the activity' do
      analytics.track_activity_assignment(teacher.id, activity.id)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_ASSIGNMENT)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:activity_name]).to eq(activity.name)
      expect(track_calls[0][:properties][:tool_name]).to eq('Diagnostic')
    end
  end

  context 'tracking activity pack assignment' do
    let(:teacher) { create(:teacher) }

    it 'sends an event with information about the activity pack when it is a diagnostic activity pack' do
      diagnostic_activity = create(:diagnostic_activity)
      diagnostic_unit_template = create(:unit_template)
      diagnostic_unit = create(:unit, unit_template_id: diagnostic_unit_template.id )
      unit_activity = create(:unit_activity, unit: diagnostic_unit, activity: diagnostic_activity)
      analytics.track_activity_pack_assignment(teacher.id, diagnostic_unit.id)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:activity_pack_type]).to eq("Diagnostic")
      expect(track_calls[0][:properties][:activity_pack_name]).to eq(diagnostic_unit.name)
    end

    it 'sends an event with information about the activity pack when it is a custom activity pack' do
      unit = create(:unit)
      analytics.track_activity_pack_assignment(teacher.id, unit.id)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:activity_pack_type]).to eq("Custom")
      expect(track_calls[0][:properties][:activity_pack_name]).to eq(unit.name)
    end

    it 'sends an event with information about the activity pack when it is a pre made activity pack' do
      unit_template = create(:unit_template)
      unit = create(:unit, unit_template_id: unit_template.id)
      activity = create(:connect_activity)
      unit_activity = create(:unit_activity, activity: activity, unit: unit)
      analytics.track_activity_pack_assignment(teacher.id, unit.id)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:activity_pack_type]).to eq("Pre-made")
      expect(track_calls[0][:properties][:activity_pack_name]).to eq(unit.name)
    end

  end

  context '#track' do
    let(:teacher) { create(:teacher) }
    let(:student) { create(:student) }

    it 'never sends events to Salesmachine, even if the user is a teacher' do
      analytics.track(teacher, {})
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:integrations]).to eq({
        all: true,
        Salesmachine: false,
        Intercom: true
      })
    end

    it 'does not send events to the Salesmachine integration when user is not a teacher' do
      analytics.track(student, {})
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:integrations]).to eq({
        all: true,
        Salesmachine: false,
        Intercom: false
      })
    end
  end
end
