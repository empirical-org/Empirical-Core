# frozen_string_literal: true

require 'rails_helper'

describe 'ScorebookQuery' do

  let!(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
  let!(:classroom) { teacher.classrooms_i_teach.first }
  let!(:classroom1) { teacher.classrooms_i_teach.second }
  let!(:student) { classroom.students.first }
  let!(:student1) { classroom1.students.first }

  let!(:teacher1) {create(:teacher) }

  let!(:standard_level) {create(:standard_level)}
  let!(:standard_category) {create(:standard_category)}
  let!(:standard) {create(:standard, standard_category: standard_category, standard_level: standard_level)}
  let!(:activity_classification) {create :activity_classification}

  let!(:activity1) {create(:activity, standard: standard, classification: activity_classification)}
  let!(:activity2) {create(:activity, standard: standard, classification: activity_classification)}

  let!(:unit) {create(:unit)}

  let!(:classroom_unit) {create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: [student.id]  )}

  let!(:unit_activity1) {create(:unit_activity, activity: activity1, unit: unit  )}
  let!(:unit_activity2) {create(:unit_activity, activity: activity2, unit: unit )}

  let!(:activity_session1) {create(:activity_session,  completed_at: Time.current, percentage: 1.0, user: student, classroom_unit: classroom_unit, activity: activity1, is_final_score: true)}
  let!(:activity_session2) {create(:activity_session,  completed_at: Time.current, percentage: 0.2, user: student, classroom_unit: classroom_unit, activity: activity2, is_final_score: true)}

  it 'returns a completed activity that is a final scores' do
    results = Scorebook::Query.run(classroom.id)
    expect(results.pluck('id')).to include(activity_session2.id)
  end

  it 'returns activities even if the underlying activity has been archived' do
    activity2.update(flags: [Activity::ARCHIVED])

    results = Scorebook::Query.run(classroom.id)
    expect(results.pluck('id')).to include(activity_session2.id)
  end

  it 'returns activities with publish dates in the future as scheduled' do
    publish_date = Time.now.utc + 1.hour
    # have to do update_columns here because otherwise the publish date is offset by a callback
    unit_activity1.update_columns(publish_date: publish_date)
    results = Scorebook::Query.run(classroom.id)
    expect(results[0]['scheduled']).to eq(true)
  end

  it 'returns activities with publish dates in the past as not scheduled' do
    publish_date = Time.now.utc - 1.hour
    # have to do update_columns here because otherwise the publish date is offset by a callback
    unit_activity1.update_columns(publish_date: publish_date)
    results = Scorebook::Query.run(classroom.id)
    expect(results[0]['scheduled']).to eq(false)
  end

  describe 'pack sequence status' do
    it 'returns activities with locked pack sequence statuses as locked: true' do
      psi = create(:pack_sequence_item, classroom_unit: classroom_unit)
      create(:user_pack_sequence_item, pack_sequence_item: psi, user: student, status: UserPackSequenceItem::LOCKED)
      results = Scorebook::Query.run(classroom.id)
      expect(results[0]['locked']).to eq(true)
    end

    it 'returns activities with unlocked pack sequence statuses as locked: false' do
      psi = create(:pack_sequence_item, classroom_unit: classroom_unit)
      create(:user_pack_sequence_item, pack_sequence_item: psi, user: student, status: UserPackSequenceItem::UNLOCKED)
      results = Scorebook::Query.run(classroom.id)
      expect(results[0]['locked']).to eq(false)
    end

    it 'returns activities with no pack sequence as locked: false' do
      results = Scorebook::Query.run(classroom.id)
      expect(results[0]['locked']).to eq(false)
    end
  end

  describe 'support date constraints' do
    it 'returns activities completed between the specified dates' do
      begin_date = activity_session1.completed_at - 1.day
      end_date = activity_session1.completed_at + 1.day
      results = Scorebook::Query.run(classroom.id, 1, nil, begin_date.to_s, end_date.to_s)
      expect(results.map{|res| res['id']}).to include(activity_session1.id)
    end

    it 'does not return activities completed after the specified end date' do
      begin_date = activity_session1.completed_at + 1.day
      end_date = activity_session1.completed_at + 2.days
      results = Scorebook::Query.run(classroom.id, 1, nil, begin_date.to_s, end_date.to_s)
      expect(results.map{|res| res['id']}).not_to include(activity_session1.id)
    end

    it 'does not return activities completed before the specified start date' do
      begin_date = activity_session1.completed_at - 2.days
      end_date = activity_session1.completed_at - 1.day
      results = Scorebook::Query.run(classroom.id, 1, nil, begin_date.to_s, end_date.to_s)
      expect(results.map{|res| res['id']}).not_to include(activity_session1.id)
    end

    describe 'time zones' do
      def activity_session_completed_at_to_time_midnight_minus_offset(activity_session, offset)
        original_completed_at = activity_session.completed_at.to_date.to_s
        new_completed_at = Scorebook::Query.to_offset_datetime(original_completed_at, offset)
        activity_session.update(completed_at: new_completed_at)
        new_completed_at
      end

      it "converts timestamps in the SELECT clause to the current user's timezone if one is provided" do
        tz = TZInfo::Timezone.get('Australia/Perth')
        offset = tz.period_for_utc(Time.new.utc).utc_total_offset

        results = Scorebook::Query.run(classroom.id, 1, nil, nil, nil, offset)

        in_user_time = (activity_session1.updated_at + offset.seconds).to_i
        updated_at = results.find { |res| res['id'] == activity_session1.id }['updated_at'].to_datetime.to_i
        expect(updated_at).to eq in_user_time
      end

      it "factors in offset to return activities where the teacher is in a different timezone than the database" do
        tz = TZInfo::Timezone.get('Australia/Perth')
        offset = tz.period_for_utc(Time.new.utc).utc_total_offset
        new_act_sesh_1_completed_at = activity_session_completed_at_to_time_midnight_minus_offset(activity_session1, offset - 1)
        new_act_sesh_2_completed_at = activity_session_completed_at_to_time_midnight_minus_offset(activity_session2, offset + 1)
        activity_session1.update(completed_at: new_act_sesh_1_completed_at)
        activity_session2.update(completed_at: new_act_sesh_2_completed_at)
        begin_date = (activity_session1.reload.completed_at).to_date.to_s
        end_date = begin_date
        results = Scorebook::Query.run(classroom.id, 1, nil, begin_date, end_date, offset)
        expect(results.find{|res| res['id'] == activity_session2.id}).to be
        expect(results.length).to eq(1)
      end
    end
  end

end
