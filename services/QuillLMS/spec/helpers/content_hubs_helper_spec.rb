# frozen_string_literal: true

require 'rails_helper'

describe ContentHubsHelper, type: :helper do
  describe '#unit_activities_include_content_activities?' do
    let(:activity) { create(:activity, id: 1) }
    let(:unit_activity) { create(:unit_activity, activity_id: activity.id) }
    let(:unit_activities) { UnitActivity.where(activity_id: unit_activity.activity_id) }

    it 'returns true if unit activities include any specified content activities' do
      content_activity_ids = [activity.id, 2, 3]

      result = helper.unit_activities_include_content_activities?(unit_activities, content_activity_ids)

      expect(result).to be true
    end

    it 'returns false if unit activities do not include any specified content activities' do
      content_activity_ids = [2, 3, 4]

      result = helper.unit_activities_include_content_activities?(unit_activities, content_activity_ids)

      expect(result).to be false
    end
  end

  describe '#course_with_assignment_data' do
    let(:course_data) { [{ activities: [{ activity_id: 1 }, { activity_id: 2 }] }] }
    let(:classrooms) { create_list(:classroom, 3) }

    it 'returns course data if classrooms are empty' do
      result = helper.course_with_assignment_data(course_data, [])

      expect(result).to eq(course_data)
    end

    it 'returns course data with assignment information' do
      classroom_ids_as_string = classrooms.map(&:id).join(',')
      allow(helper).to receive(:assignment_data_for_unit_template).and_return(course_data.first)

      result = helper.course_with_assignment_data(course_data, classrooms)

      expect(result).to eq(course_data)
      expect(helper).to have_received(:assignment_data_for_unit_template).with(course_data.first, classroom_ids_as_string).exactly(1).times
    end
  end

  describe '#assignment_data_for_unit_template' do
    let(:activity) { create(:activity) }
    let(:unit_template) { { activities: [{ activity_id: activity.id }] } }
    let(:classroom) { create(:classroom) }
    let(:classroom_student1) { create(:students_classrooms, classroom: ) }
    let(:classroom_student2) { create(:students_classrooms, classroom: ) }
    let(:classroom_ids_as_string) { classroom.id.to_s }

    it 'returns unit template with assignment data' do
      unit = create(:unit)
      create(:unit_activity, activity_id: activity.id, unit_id: unit.id)
      classroom_unit = create(:classroom_unit, unit_id: unit.id, classroom_id: classroom.id, assigned_student_ids: [classroom_student1.student_id, classroom_student2.student_id])
      create(:activity_session, classroom_unit_id: classroom_unit.id, activity_id: activity.id, user_id: classroom_student1.student_id, is_final_score: true, percentage: 80)

      result = helper.assignment_data_for_unit_template(unit_template, classroom_ids_as_string)

      activity = result[:activities].first
      expect(activity[:assigned_student_count]).to eq(2)
      expect(activity[:completed_student_count]).to eq(1)
      expect(activity[:average_score]).to eq(80)
      expect(activity[:link_for_report]).to be_a(String)
    end
  end

  describe '#get_link_for_report' do
    let(:activity) { { activity_id: 1 } }
    let(:classroom_units) { [double('ClassroomUnit', unit_id: 1, classroom_id: 1)] }
    let(:activity_sessions) { [double('ActivitySession', unit: double('Unit', id: 1), classroom: double('Classroom', id: 1))] }

    it 'returns a link for the report if unit_id and classroom_id are present' do
      result = helper.get_link_for_report(activity, classroom_units, activity_sessions)

      expect(result).to eq('/teachers/progress_reports/diagnostic_reports#/u/1/a/1/c/1/students')
    end

    it 'returns nil if unit_id is not present' do
      allow(helper).to receive(:unit_id_for_report).and_return(nil)
      result = helper.get_link_for_report(activity, classroom_units, activity_sessions)

      expect(result).to be_nil
    end

    it 'returns nil if classroom_id is not present' do
      allow(helper).to receive(:classroom_id_for_report).and_return(nil)
      result = helper.get_link_for_report(activity, classroom_units, activity_sessions)

      expect(result).to be_nil
    end
  end

  describe '#unit_id_for_report' do
    let(:last_classroom_unit) { double('ClassroomUnit', unit_id: 1) }
    let(:last_activity_session) { double('ActivitySession', unit: double('Unit', id: 2)) }

    it 'returns the unit id from the last activity session if present' do
      result = helper.unit_id_for_report(last_classroom_unit, last_activity_session)

      expect(result).to eq(2)
    end

    it 'returns the unit id from the last classroom unit if last activity session unit is nil' do
      allow(last_activity_session).to receive(:unit).and_return(nil)
      result = helper.unit_id_for_report(last_classroom_unit, last_activity_session)

      expect(result).to eq(1)
    end
  end

  describe '#classroom_id_for_report' do
    let(:last_classroom_unit) { double('ClassroomUnit', classroom_id: 1) }
    let(:last_activity_session) { double('ActivitySession', classroom: double('Classroom', id: 2)) }

    it 'returns the classroom id from the last activity session if present' do
      result = helper.classroom_id_for_report(last_classroom_unit, last_activity_session)

      expect(result).to eq(2)
    end

    it 'returns the classroom id from the last classroom unit if last activity session classroom is nil' do
      allow(last_activity_session).to receive(:classroom).and_return(nil)
      result = helper.classroom_id_for_report(last_classroom_unit, last_activity_session)

      expect(result).to eq(1)
    end
  end


  describe '#world_history_1200_to_present_data' do
    it 'returns an array of world history units with the expected structure' do
      result = helper.world_history_1200_to_present_data

      expect(result).to be_an(Array)
      expect(result).not_to be_empty

      result.each do |unit|
        expect(unit).to have_key(:display_name)
        expect(unit).to have_key(:description)
        expect(unit).to have_key(:unit_template_id)
        expect(unit).to have_key(:oer_unit_website)
        expect(unit).to have_key(:oer_unit_teacher_guide)
        expect(unit).to have_key(:all_oer_articles)
        expect(unit).to have_key(:all_quill_articles_href)
        expect(unit).to have_key(:oer_unit_number)
        expect(unit).to have_key(:quill_teacher_guide_href)
        expect(unit).to have_key(:activities)

        activities = unit[:activities]
        expect(activities).to be_an(Array)
        expect(activities).to all(have_key(:activity_id))
        expect(activities).to all(have_key(:display_name))
        expect(activities).to all(have_key(:description))
        expect(activities).to all(have_key(:paired_oer_asset_name))
        expect(activities).to all(have_key(:paired_oer_asset_link))
      end
    end
  end
end
